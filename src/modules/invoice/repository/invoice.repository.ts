import Invoice from "../domain/entity/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway.interface";
import InvoiceModel from "./invoice.model";
import ProductModel from "./product.model";

export default class InvoiceRepository implements InvoiceGateway {

    find(id: string): Promise<Invoice> {
        throw new Error("Method not implemented.");
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