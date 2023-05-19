import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import OrderItem from "./order-item.entity";

type OrderProps = {
    id?: Id;
    clientId: string;
    status?: string;
    items: OrderItem[];
    invoiceId?: string;
};

export default class Order extends BaseEntity implements AggregateRoot {
    private _clientId: string;
    private _status: string;
    private _items: OrderItem[];
    private _total: number;
    private _invoiceId: string;

    constructor(props: OrderProps) {
        super(props.id);
        this._clientId = props.clientId;
        this._status = props.status || "pending";
        this._items = props.items;
        this._invoiceId = props.invoiceId;
        this.calculateTotal();
    }

    approve(): void {
        this._status = "approved";
    }

    set invoiceId(invoiceId: string) {
        this._invoiceId = invoiceId;
    }

    calculateTotal() {
        this._total = this._items.reduce((total, item) => {
            return total + item.salesPrice;
        }, 0);
    }

    get clientId(): string {
        return this._clientId;
    }

    get status(): string {
        return this._status;
    }

    get items(): OrderItem[] {
        return this._items;
    }

    get invoiceId(): string {
        return this._invoiceId;
    }

    get total(): number {
        return this._total;
    }
}