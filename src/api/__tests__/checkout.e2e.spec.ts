import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for checkout", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should checkout an order", async () => {
        const clientId = "1";

        const responseClient = await request(app)
            .post("/clients")
            .send({
                id: clientId,
                name: "John",
                email: "john@gmail.com",
                document: "000",
                street: "street",
                number: "number",
                complement: "complement",
                city: "city",
                state: "state",
                zipCode: "zipCode",
            });
        expect(responseClient.status).toBe(201);

        const responseProduct1 = await request(app)
            .post("/products")
            .send({
                id: "1",
                name: "iPhone",
                description: "very good phone",
                purchasePrice: 6000.00,
                stock: 1000,
            });
        expect(responseProduct1.status).toBe(201);

        const responseProduct2 = await request(app)
            .post("/products")
            .send({
                id: "2",
                name: "iPhone 2",
                description: "very good phone",
                purchasePrice: 6000.00,
                stock: 1000,
            });
        expect(responseProduct2.status).toBe(201);

        const response = await request(app)
            .post("/checkout")
            .send({
                clientId: clientId,
                products: [
                    { productId: "1" }, { productId: "2" }
                ],
            });
        expect(response.status).toBe(201);
    });
});