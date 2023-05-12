import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
    return {
        find: jest.fn(),
        save: jest.fn(),
    }
}

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

describe("Unit test to generate invoice use case", function () {
    it("should generate an invoice", async () => {
        const mockRepository = MockRepository();
        const usecase = new GenerateInvoiceUseCase(mockRepository);
        const output = await usecase.execute(input);

        expect(mockRepository.save).toBeCalled();

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