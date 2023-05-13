import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "./client.entity";
import Product from "./product.entity";

type OrderProps = {
    id?: Id;
    client: Client;
    status?: string;
    items: Product[];
};

export default class Order extends BaseEntity implements AggregateRoot {
    private _client: Client;
    private _status: string;
    private _items: Product[];
    private _total: number;

    constructor(props: OrderProps) {
        super(props.id);
        this._client = props.client;
        this._status = props.status || "pending";
        this._items = props.items;
        this.calculateTotal();
    }

    approve() {
        this._status = "approved";
    }

    calculateTotal() {
        this._total = this._items.reduce((total, item) => {
            return total + item.salesPrice;
        }, 0);
    }

    get client(): Client {
        return this._client;
    }

    get status(): string {
        return this._status;
    }

    get items(): Product[] {
        return this._items;
    }

    get total(): number {
        return this._total;
    }
}