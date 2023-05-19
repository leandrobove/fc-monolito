import { Sequelize } from "sequelize-typescript";
import { OrderItemModel } from "./order-items.model";
import { OrderModel } from "./order.model";
import OrderRepository from "./order.repository";
import Id from "../../@shared/domain/value-object/id.value-object";
import OrderItem from "../domain/order-item.entity";
import Order from "../domain/order.entity";

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

describe("OrderRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([OrderModel, OrderItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should add an order", async () => {
        const orderRepository = new OrderRepository();

        const order = new Order({
            clientId: clientId,
            items: products,
            invoiceId: "1",
        });

        await orderRepository.addOrder(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id.id },
            include: ["items"],
            rejectOnEmpty: true,
        });

        expect(orderModel.id).toBe(order.id.id);
        expect(orderModel.clientId).toBe(order.clientId);
        expect(orderModel.status).toBe(order.status);
        expect(orderModel.total).toBe(order.total);
        expect(orderModel.invoiceId).toBe(order.invoiceId);
        expect(orderModel.items.length).toBe(2);
        expect(orderModel.items[0].salesPrice).toBe(order.items[0].salesPrice);
        expect(orderModel.items[0].productId).toBe(order.items[0].productId);
        expect(orderModel.createdAt).not.toBeNull();
    });

    it("should find an order", async () => {
        const orderRepository = new OrderRepository();
        const order = new Order({
            clientId: clientId,
            items: products,
            invoiceId: "1"
        });
        await orderRepository.addOrder(order);

        const orderFound = await orderRepository.find(order.id.id);

        expect(orderFound.id.id).toBe(order.id.id);
        expect(orderFound.clientId).toBe(order.clientId);
        expect(orderFound.status).toBe(order.status);
        expect(orderFound.total).toBe(order.total);
        expect(orderFound.invoiceId).toBe(order.invoiceId);
        expect(orderFound.items.length).toBe(2);
        expect(orderFound.items[0].salesPrice).toBe(order.items[0].salesPrice);
        expect(orderFound.items[0].description).toBe(order.items[0].description);
        expect(orderFound.items[0].name).toBe(order.items[0].name);
        expect(orderFound.items[0].productId).toBe(order.items[0].productId);
        expect(orderFound.createdAt).not.toBeNull();
    });
});