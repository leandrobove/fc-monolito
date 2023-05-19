import { InvoiceProductModel } from "../../modules/invoice/repository/invoice-product.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for invoices", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should find an invoice", async () => {
        const invoiceId = "1";

        await InvoiceModel.create(
            {
                id: invoiceId,
                name: "John",
                document: "000",
                addressStreet: "street",
                addressNumber: "number",
                addressComplement: "complement",
                addressCity: "city",
                addressState: "state",
                addressZipCode: "zipCode",
                items: [
                    {
                        id: "1",
                        name: "iPhone",
                        price: 6000.00,
                    },
                    {
                        id: "2",
                        name: "iPad",
                        price: 10000.00,
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                include: [{ model: InvoiceProductModel }],
            }
        );


        const response = await request(app)
            .get(`/invoices/${invoiceId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(invoiceId);
        expect(response.body.name).toBe("John");
        expect(response.body.document).toBe("000");
        expect(response.body.address).toBeDefined();
        expect(response.body.items.length).toBe(2);
        expect(response.body.total).toBe(16000.00);
        expect(response.body.createdAt).toBeDefined();
    });
});