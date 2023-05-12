import { FindInvoiceFacadeOutputDto } from "./find-invoice.facade.dto";
import { FindInvoiceFacadeInputDto } from "./find-invoice.facade.dto";
import { GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./generate-invoice.facade.dto";

export default interface InvoiceFacadeInterface {
    generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto>;
    find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto>;
}