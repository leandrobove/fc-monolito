import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceModel from "./invoice.model";
import Invoice from "../domain/entity/invoice.entity";
import Address from "../domain/value-object/address.value-object";
import Product from "../domain/entity/product.entity";
import InvoiceRepository from "./invoice.repository";
import InvoiceProductModel from "./invoice-product.model";

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

describe("InvoiceRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([InvoiceModel, InvoiceProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should save an invoice", async () => {
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

    it("should find na invoice", async () => {
        const invoiceRepository = new InvoiceRepository();

        await invoiceRepository.save(invoice);

        const invoiceFound = await invoiceRepository.find(invoice.id.id);

        expect(invoiceFound.id).toEqual(invoice.id);
        expect(invoiceFound.name).toBe(invoice.name);
        expect(invoiceFound.document).toBe(invoice.document);
        expect(invoiceFound.Address.street).toBe(invoice.Address.street);
        expect(invoiceFound.Address.number).toBe(invoice.Address.number);
        expect(invoiceFound.Address.complement).toBe(invoice.Address.complement);
        expect(invoiceFound.Address.city).toBe(invoice.Address.city);
        expect(invoiceFound.Address.state).toBe(invoice.Address.state);
        expect(invoiceFound.Address.zipCode).toBe(invoice.Address.zipCode);

        //items
        expect(invoiceFound.items.length).toEqual(2);
        invoiceFound.items.forEach((item, index) => {
            expect(item.id).toEqual(invoice.items[index].id);
            expect(item.name).toBe(invoice.items[index].name);
            expect(item.price).toBe(invoice.items[index].price);
        });

        expect(invoiceFound.createdAt).not.toBeNull();
        expect(invoiceFound.updatedAt).not.toBeNull()
    });
});