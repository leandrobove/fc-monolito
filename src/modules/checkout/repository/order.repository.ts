import Id from "../../@shared/domain/value-object/id.value-object";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { OrderItemModel } from "./order-items.model";
import { OrderModel } from "./order.model";

export default class OrderRepository implements CheckoutGateway {

    async addOrder(order: Order): Promise<void> {
        await OrderModel.create(
            {
                id: order.id.id,
                clientId: order.clientId,
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
                include: [{ model: OrderItemModel }],
            });
    }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({
            where: { id: id },
            include: [OrderItemModel],
            rejectOnEmpty: true,
        });

        return new Order({
            id: new Id(orderModel.id),
            clientId: orderModel.clientId,
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