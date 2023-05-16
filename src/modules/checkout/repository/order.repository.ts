import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { ClientModel } from "./client.model";
import OrderItemModel from "./order-items.model";
import OrderModel from "./order.model";

export default class OrderRepository implements CheckoutGateway {

    async addOrder(order: Order): Promise<void> {
        await OrderModel.create(
            {
                id: order.id.id,
                clientId: order.client.id.id,
                client: {
                    id: order.client.id.id,
                    name: order.client.name,
                    email: order.client.email,
                    street: order.client.address.street,
                    number: order.client.address.number,
                    complement: order.client.address.complement,
                    city: order.client.address.city,
                    state: order.client.address.state,
                    zipCode: order.client.address.zipCode,
                },
                invoiceId: order.invoiceId,
                status: order.status,
                items: order.items.map((p) => ({
                    id: p.id.id,
                    name: p.name,
                    description: p.description,
                    salesPrice: p.salesPrice,
                })),
                total: order.total,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            },
            {
                include: [{ model: OrderItemModel }, { model: ClientModel }],
            });
    }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({
            where: { id: id },
            include: ["items", "client"],
            rejectOnEmpty: true,
        });

        return new Order({
            id: new Id(orderModel.id),
            client: new Client({
                id: new Id(orderModel.clientId),
                name: orderModel.client.name,
                email: orderModel.client.email,
                address: new Address({
                    street: orderModel.client.street,
                    number: orderModel.client.number,
                    complement: orderModel.client.complement,
                    city: orderModel.client.city,
                    state: orderModel.client.state,
                    zipCode: orderModel.client.zipCode
                }),
            }),
            status: orderModel.status,
            items: orderModel.items.map((product) => (new Product({
                id: new Id(product.id),
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
            }))),
            invoiceId: orderModel.invoiceId,
        });
    }

}