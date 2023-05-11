import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/entity/invoice.entity";
import Product from "../../domain/entity/product.entity";
import Address from "../../domain/value-object/address.value-object";
import InvoiceGateway from "../../gateway/invoice.gateway.interface";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {

    private _invoiceRepository: InvoiceGateway;

    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository;
    }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        const invoice = new Invoice({
            name: input.name,
            document: input.document,
            address: new Address({
                street: input.street,
                number: input.number,
                complement: input.complement,
                city: input.city,
                state: input.state,
                zipCode: input.zipCode,
            }),
            items: input.items.map(
                (item) =>
                    new Product({
                        id: new Id(item.id),
                        name: item.name,
                        price: item.price,
                    })
            )
        });

        await this._invoiceRepository.save(invoice);

        return this.toOutputDto(invoice);
    }

    private toOutputDto(invoice: Invoice): GenerateInvoiceUseCaseOutputDto {
        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.Address.street,
            number: invoice.Address.number,
            complement: invoice.Address.complement,
            city: invoice.Address.city,
            state: invoice.Address.state,
            zipCode: invoice.Address.zipCode,
            items: invoice.items.map((item: any) => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            total: invoice.total,
        };
    }
}