import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../value-object/address.value-object";
import Invoice from "./invoice.entity";
import Product from "./product.entity";

describe("Invoice unit test", () => {
    it("should calculate the invoice total", () => {
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

        const invoice1 = new Invoice({
            id: new Id("123"),
            name: "Name",
            document: "12345",
            address: address,
        });

        invoice1.addItems(products);

        const invoice2 = new Invoice({
            id: new Id("123"),
            name: "Name",
            document: "12345",
            address: address,
            items: products
        });

        expect(invoice1.total).toBe(15000.00);
        expect(invoice2.total).toBe(15000.00);
    });
});