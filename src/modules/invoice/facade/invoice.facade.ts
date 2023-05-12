import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto } from "./find-invoice.facade.dto";
import { GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./generate-invoice.facade.dto";
import InvoiceFacadeInterface from "./invoice.facade.interface";

export default class InvoiceFacade implements InvoiceFacadeInterface {

    private _generateInvoiceUseCase: UseCaseInterface;
    private _findInvoiceUseCase: UseCaseInterface;

    constructor(generateInvoiceUseCase: UseCaseInterface, findInvoiceUseCase: UseCaseInterface) {
        this._generateInvoiceUseCase = generateInvoiceUseCase;
        this._findInvoiceUseCase = findInvoiceUseCase;
    }

    async find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
        const useCaseOutput = await this._findInvoiceUseCase.execute({ id: input.id });

        return {
            id: useCaseOutput.id,
            name: useCaseOutput.name,
            document: useCaseOutput.document,
            address: {
                street: useCaseOutput.address.street,
                number: useCaseOutput.address.number,
                complement: useCaseOutput.address.complement,
                city: useCaseOutput.address.city,
                state: useCaseOutput.address.state,
                zipCode: useCaseOutput.address.zipCode,
            },
            items: useCaseOutput.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                price: item.price
            })),
            total: useCaseOutput.total,
            createdAt: useCaseOutput.createdAt,
        }
    }

    async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        const useCaseInputDto = {
            name: input.name,
            document: input.document,
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,
            items: input.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
            }))
        };
        const useCaseOutput = await this._generateInvoiceUseCase.execute(useCaseInputDto);

        return {
            id: useCaseOutput.id,
            name: useCaseOutput.name,
            document: useCaseOutput.document,
            street: useCaseOutput.street,
            number: useCaseOutput.number,
            complement: useCaseOutput.complement,
            city: useCaseOutput.city,
            state: useCaseOutput.state,
            zipCode: useCaseOutput.zipCode,
            items: useCaseOutput.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                price: item.price,
            })),
            total: useCaseOutput.total,
        };
    }
}