import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/entity/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway.interface";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.dto";

export default class FindInvoiceUseCase implements UseCaseInterface {

    private _invoiceRepository: InvoiceGateway;

    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository;
    }

    async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
        const invoice = await this._invoiceRepository.find(input.id);

        return this.toInvoiceDto(invoice);
    }

    private toInvoiceDto(invoice: Invoice): FindInvoiceUseCaseOutputDTO {
        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            address: {
                street: invoice.Address.street,
                number: invoice.Address.number,
                complement: invoice.Address.complement,
                city: invoice.Address.city,
                state: invoice.Address.state,
                zipCode: invoice.Address.zipCode,
            },
            items: invoice.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            total: invoice.total,
            createdAt: invoice.createdAt,
        };
    }
}