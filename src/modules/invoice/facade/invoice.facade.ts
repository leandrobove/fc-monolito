import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export default class InvoiceFacade implements InvoiceFacadeInterface {

    private _generateInvoiceUseCase: UseCaseInterface;

    constructor(generateInvoiceUseCase: UseCaseInterface) {
        this._generateInvoiceUseCase = generateInvoiceUseCase;
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