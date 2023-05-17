import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for clients", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should add a new client", async () => {
        const response = await request(app)
            .post("/clients")
            .send({
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

        expect(response.status).toBe(201);
    });

    it("should find a client", async () => {
        const clientId = "1";

        const client = await request(app)
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
        expect(client.status).toBe(201);

        const response = await request(app)
            .get(`/clients/${clientId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(clientId);
        expect(response.body.name).toBe("John");
        expect(response.body.email).toBe("john@gmail.com");
        expect(response.body.document).toBe("000");
        expect(response.body.street).toBe("street");
        expect(response.body.number).toBe("number");
        expect(response.body.complement).toBe("complement");
        expect(response.body.city).toBe("city");
        expect(response.body.state).toBe("state");
        expect(response.body.zipCode).toBe("zipCode");
        expect(response.body.createdAt).not.toBeNull();
        expect(response.body.updatedAt).not.toBeNull();
    });
});