import Id from "../../@shared/domain/value-object/id.value-object";
import Order from "./order.entity";
import OrderItem from "./order-item.entity";

const clientId = "123";

const prod1 = new OrderItem({
    id: new Id("ABC"),
    name: "iPhone",
    description: "Very good phone",
    salesPrice: 6000.00,
    productId: "1",
});

const prod2 = new OrderItem({
    id: new Id("ABCD"),
    name: "iPad",
    description: "Very good tablet",
    salesPrice: 10000.00,
    productId: "2",
});

const products = [prod1, prod2];

describe("Order entity unit tests", () => {
    it("should create an order", () => {
        const order = new Order({
            clientId: clientId,
            items: products,
        });

        expect(order.id).toBeDefined();
        expect(order.status).toBe("pending");
        expect(order.items).toBe(products);
        expect(order.items.length).toBe(2);
        expect(order.clientId).toBe(clientId);
        expect(order.total).toBe(16000.00);
        expect(order.items[0].productId).toBe("1");
        expect(order.items[1].productId).toBe("2");
        expect(order.createdAt).not.toBeNull();
    });

    it("should approve an order", () => {
        const order = new Order({
            clientId: clientId,
            items: products,
        });
        order.approve();

        expect(order.status).toBe("approved");
    });
});