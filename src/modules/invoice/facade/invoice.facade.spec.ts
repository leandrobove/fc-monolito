import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import InvoiceProductModel from "../repository/invoice-product.model";
import ProductModel from "../repository/product.model";

describe("InvoiceFacade tests", function () {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([InvoiceModel, InvoiceProductModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should generate an invoice", async () => {
        const input = {
            name: "Name",
            document: "12345",
            street: "street",
            number: "5",
            complement: "",
            city: "city",
            state: "state",
            zipCode: "000",
            items: [
                {
                    id: "123",
                    name: "iPhone",
                    price: 6000.00,
                },
                {
                    id: "1234",
                    name: "iPad",
                    price: 9000.00
                }
            ]
        }

        const invoiceRepository = new InvoiceRepository();
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);

        const invoiceFacade = new InvoiceFacade(generateInvoiceUseCase);
        const output = await invoiceFacade.generate(input);
        
        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            document: input.document,
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,
            items: [
                {
                    id: input.items[0].id,
                    name: input.items[0].name,
                    price: input.items[0].price,
                },
                {
                    id: input.items[1].id,
                    name: input.items[1].name,
                    price: input.items[1].price,
                }
            ],
            total: 15000.00,
        });
    });
});