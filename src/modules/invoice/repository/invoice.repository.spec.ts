import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceModel from "./invoice.model";
import Invoice from "../domain/entity/invoice.entity";
import Address from "../domain/value-object/address.value-object";
import Product from "../domain/entity/product.entity";
import InvoiceRepository from "./invoice.repository";
import ProductModel from "./product.model";
import InvoiceProductModel from "./invoice-product.model";

describe("InvoiceRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([InvoiceModel, ProductModel, InvoiceProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should save a invoice", async () => {
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
            items: products
        });

        const invoiceRepository = new InvoiceRepository();

        await invoiceRepository.save(invoice);

        const invoiceModel = await InvoiceModel.findOne({
            where: { id: invoice.id.id },
            include: ["items"],
        });

        expect(invoiceModel.id).toBe(invoice.id.id);
        expect(invoiceModel.name).toBe(invoice.name);
        expect(invoiceModel.document).toBe(invoice.document);
        expect(invoiceModel.addressStreet).toBe(invoice.Address.street);
        expect(invoiceModel.addressNumber).toBe(invoice.Address.number);
        expect(invoiceModel.addressComplement).toBe(invoice.Address.complement);
        expect(invoiceModel.addressCity).toBe(invoice.Address.city);
        expect(invoiceModel.addressState).toBe(invoice.Address.state);
        expect(invoiceModel.addressZipCode).toBe(invoice.Address.zipCode);
        
        //items
        expect(invoiceModel.items.length).toEqual(2);
        invoiceModel.items.forEach((item, index) => {
            expect(item.id).toBe(invoice.items[index].id.id);
            expect(item.name).toBe(invoice.items[index].name);
            expect(item.price).toBe(invoice.items[index].price);
        });

        expect(invoiceModel.createdAt).toStrictEqual(invoice.createdAt);
        expect(invoiceModel.updatedAt).toStrictEqual(invoice.updatedAt);
    });
});