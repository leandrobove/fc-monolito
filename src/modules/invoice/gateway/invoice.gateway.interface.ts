import Invoice from "../domain/entity/invoice.entity";

export default interface InvoiceGateway {
    find(id: string): Promise<Invoice>;
    save(invoice: Invoice): Promise<void>;
}