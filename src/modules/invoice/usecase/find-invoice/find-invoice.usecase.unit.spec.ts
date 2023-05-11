import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/entity/invoice.entity";
import Product from "../../domain/entity/product.entity";
import Address from "../../domain/value-object/address.value-object";
import FindInvoiceUseCase from "./find-invoice.usecase";

const address = new Address({
    street: "street",
    number: "5",
    complement: "",
    city: "city",
    state: "state",
    zipCode: "000"
});

const prod1 = new Product({
    id: new Id("123"),
    name: "iPhone",
    price: 6000.00,
});
const prod2 = new Product({
    id: new Id("1234"),
    name: "iPad",
    price: 9000.00,
});
const products = [prod1, prod2]

const invoice = new Invoice({
    id: new Id("123"),
    name: "Name",
    document: "12345",
    address: address,
    items: products,
});

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        save: jest.fn(),
    }
}

describe("Unit test find invoice use case", function () {
    it("should find an invoice", async () => {
        const input = {
            id: "123"
        }

        const invoiceRepository = MockRepository();
        const usecase = new FindInvoiceUseCase(invoiceRepository);
        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: input.id,
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
            items: [
                {
                    id: invoice.items[0].id.id,
                    name: invoice.items[0].name,
                    price: invoice.items[0].price,
                },
                {
                    id: invoice.items[1].id.id,
                    name: invoice.items[1].name,
                    price: invoice.items[1].price,
                }
            ],
            total: 15000.00,
            createdAt: invoice.createdAt,
        });
    });
});