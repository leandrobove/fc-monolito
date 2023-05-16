import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for products", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should add a new product", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                name: "iPhone",
                description: "very good phone",
                purchasePrice: 6000.00,
                stock: 1000,
            });

        expect(response.status).toBe(201);
        expect(response.body.id).not.toBeNull();
        expect(response.body.name).toBe("iPhone");
        expect(response.body.description).toBe("very good phone");
        expect(response.body.purchasePrice).toBe(6000.00);
        expect(response.body.stock).toBe(1000);
        expect(response.body.createdAt).not.toBeNull();
        expect(response.body.updatedAt).not.toBeNull();
    });

    it("should find all products", async () => {
        const responseProduct1 = await request(app)
            .post("/products")
            .send({
                name: "iPhone",
                description: "very good phone",
                purchasePrice: 6000.00,
                stock: 1000,
            });
        const responseProduct2 = await request(app)
            .post("/products")
            .send({
                name: "iPad",
                description: "very good tablet",
                purchasePrice: 10000.00,
                stock: 500,
            });

        expect(responseProduct1.status).toBe(201);
        expect(responseProduct2.status).toBe(201);

        const response = await request(app)
            .get("/products");

        expect(response.status).toBe(200);
        expect(response.body.products.length).toBe(2);
        expect(response.body.products[0].id).not.toBeNull();
        expect(response.body.products[1].id).not.toBeNull();
        expect(response.body.products[0].name).toBe("iPhone");
        expect(response.body.products[1].name).toBe("iPad");
        expect(response.body.products[0].description).toBe("very good phone");
        expect(response.body.products[1].description).toBe("very good tablet");
        expect(response.body.products[0].salesPrice).toBe(6000.00);
        expect(response.body.products[1].salesPrice).toBe(10000.00);
    });
});