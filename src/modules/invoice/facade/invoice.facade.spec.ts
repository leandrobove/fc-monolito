import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceProductModel from "../repository/invoice-product.model";
import ProductModel from "../repository/product.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

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

        const invoiceFacade = InvoiceFacadeFactory.create();
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

    it("should find an invoice", async () => {
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

        const facade = InvoiceFacadeFactory.create();

        const output = await facade.generate(input);
        const found = await facade.find({ id: output.id });

        expect(found).toBeDefined();
        expect(found.id).toBeDefined();
        expect(found.name).toBe(input.name);
        expect(found.document).toBe(input.document);
        expect(found.address.street).toBe(input.street);
        expect(found.address.number).toBe(input.number);
        expect(found.address.complement).toBe(input.complement);
        expect(found.address.city).toBe(input.city);
        expect(found.address.state).toBe(input.state);
        expect(found.address.zipCode).toBe(input.zipCode);
        expect(found.items.length).toBe(input.items.length);
        found.items.forEach((item, index) => {
            expect(item.id).toBe(input.items[index].id);
            expect(item.name).toBe(input.items[index].name);
            expect(item.price).toBe(input.items[index].price);
        });
        expect(found.total).toBe(15000.00);
        expect(found.createdAt).toBeDefined();
    });
});