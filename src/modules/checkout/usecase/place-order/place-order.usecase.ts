import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import { PaymentFacadeOutputDto } from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {

    private _clientFacade: ClientAdmFacadeInterface;
    private _productFacade: ProductAdmFacadeInterface;
    private _catalogFacade: StoreCatalogFacadeInterface;
    private _paymentFacade: PaymentFacadeInterface;
    private _invoiceFacade: InvoiceFacadeInterface;
    private _checkoutRepository: CheckoutGateway;

    constructor(clientFacade: ClientAdmFacadeInterface, productFacade: ProductAdmFacadeInterface,
        catalogFacade: StoreCatalogFacadeInterface, paymentFacade: PaymentFacadeInterface,
        invoiceFacade: InvoiceFacadeInterface, checkoutRepository: CheckoutGateway) {
        this._clientFacade = clientFacade;
        this._productFacade = productFacade;
        this._catalogFacade = catalogFacade;
        this._paymentFacade = paymentFacade;
        this._invoiceFacade = invoiceFacade;
        this._checkoutRepository = checkoutRepository;
    }

    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
        //validate client
        const findClientFacadeOutputDto = await this._clientFacade.find({ id: input.clientId });
        if (!findClientFacadeOutputDto) {
            throw new Error("Client not found");
        }

        //validate products
        await this.validateProducts(input);

        //get products and create product object array
        const products: Product[] = await Promise.all(
            input.products.map((p) => this.getProduct(p.productId))
        );

        //create client object
        const client: Client = new Client({
            id: new Id(findClientFacadeOutputDto.id),
            name: findClientFacadeOutputDto.name,
            email: findClientFacadeOutputDto.email,
            address: findClientFacadeOutputDto.street,
        });

        //create order object
        const order: Order = new Order({
            client: client,
            items: products,
        });

        //process payment
        const payment: PaymentFacadeOutputDto = await this._paymentFacade.process({
            orderId: order.id.id,
            amount: order.total,
        });

        //generate invoice whether payment approved
        const invoice = payment.status === "approved" ? await this._invoiceFacade.generate({
            name: client.name,
            document: findClientFacadeOutputDto.document,
            street: findClientFacadeOutputDto.street,
            number: findClientFacadeOutputDto.number,
            complement: findClientFacadeOutputDto.complement,
            city: findClientFacadeOutputDto.city,
            state: findClientFacadeOutputDto.state,
            zipCode: findClientFacadeOutputDto.zipCode,
            items: products.map((p) => {
                return {
                    id: p.id.id,
                    name: p.name,
                    price: p.salesPrice,
                };
            }),
        }) : null;

        //change order status whether payment approved
        payment.status === "approved" && order.approve();

        //persist order into the database
        this._checkoutRepository.addOrder(order);

        return {
            id: order.id.id,
            invoiceId: payment.status === "approved" ? invoice.id : null,
            status: order.status,
            total: order.total,
            products: order.items.map((p) => {
                return {
                    productId: p.id.id,
                };
            }),
        };
    }

    private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
        if (input.products.length === 0) {
            throw new Error("No products selected");
        }

        for (const p of input.products) {
            const product = await this._productFacade.checkStock({
                productId: p.productId,
            });
            if (product.stock <= 0) {
                throw new Error(
                    `Product ${product.productId} is not available in stock`
                );
            }
        }
    }

    private async getProduct(productId: string): Promise<Product> {
        const productFound = await this._catalogFacade.find({ id: productId });

        if (!productFound) {
            throw new Error("Product not found");
        }

        return new Product({
            id: new Id(productFound.id),
            name: productFound.name,
            description: productFound.description,
            salesPrice: productFound.salesPrice,
        });
    }
}