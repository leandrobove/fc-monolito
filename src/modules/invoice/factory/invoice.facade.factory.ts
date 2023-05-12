import InvoiceFacade from "../facade/invoice.facade";
import InvoiceFacadeInterface from "../facade/invoice.facade.interface";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory {

    private constructor() { }

    static create(): InvoiceFacadeInterface {
        const invoiceRepository = new InvoiceRepository();
        const generateUseCase = new GenerateInvoiceUseCase(invoiceRepository);
        const findUseCase = new FindInvoiceUseCase(invoiceRepository);

        return new InvoiceFacade(generateUseCase, findUseCase);
    }
}