import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice.entity";
import Product from "../domain/entity/product.entity";
import Address from "../domain/value-object/address.value-object";
import InvoiceGateway from "../gateway/invoice.gateway.interface";
import InvoiceProductModel from "./invoice-product.model";
import InvoiceModel from "./invoice.model";
import ProductModel from "./product.model";

export default class InvoiceRepository implements InvoiceGateway {

    async find(id: string): Promise<Invoice> {
        const invoiceModel = await InvoiceModel.findOne({
            where: { id: id },
            include: [ProductModel, InvoiceProductModel],
            rejectOnEmpty: true,
        });

        return new Invoice({
            id: new Id(invoiceModel.id),
            name: invoiceModel.name,
            document: invoiceModel.document,
            address: new Address({
                street: invoiceModel.addressStreet,
                number: invoiceModel.addressNumber,
                complement: invoiceModel.addressComplement,
                city: invoiceModel.addressCity,
                state: invoiceModel.addressState,
                zipCode: invoiceModel.addressZipCode
            }),
            items: invoiceModel.items.map((item: ProductModel) => new Product({
                id: new Id(item.id),
                name: item.name,
                price: item.price,
            })),
            createdAt: invoiceModel.createdAt,
            updatedAt: invoiceModel.updatedAt,
        });
    }

    async save(invoice: Invoice): Promise<void> {
        await InvoiceModel.create(
            {
                id: invoice.id.id,
                name: invoice.name,
                document: invoice.document,
                addressStreet: invoice.Address.street,
                addressNumber: invoice.Address.number,
                addressComplement: invoice.Address.complement,
                addressCity: invoice.Address.city,
                addressState: invoice.Address.state,
                addressZipCode: invoice.Address.zipCode,
                items: invoice.items.map((item) => ({
                    id: item.id.id,
                    name: item.name,
                    price: item.price,
                })),
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt,
            },
            {
                include: [{ model: ProductModel }],
            }
        );
    }
}