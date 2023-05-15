import Order from "../domain/order.entity";

export default interface CheckoutGateway {
    addOrder(order: Order): Promise<void>;
    find(id: string): Promise<Order | null>;
}