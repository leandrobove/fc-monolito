
import AggregateRoot from "../../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../../@shared/domain/entity/base.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../value-object/address.value-object";
import Product from "./product.entity";

type InvoiceProps = {
    id?: Id;
    name: string;
    document: string;
    address: Address;
    items?: Product[];
    createdAt?: Date;
    updatedAt?: Date;
}

export default class Invoice extends BaseEntity implements AggregateRoot {
    private _name: string;
    private _document: string;
    private _address: Address
    private _items: Product[]

    constructor(props: InvoiceProps) {
        super(props.id, props.createdAt, props.updatedAt);
        this._name = props.name;
        this._document = props.document;
        this._address = props.address;
        this._items = props.items || [];
    }

    addItem(product: Product): void {
        this._items.push(product);
    }

    addItems(products: Product[]): void {
        products.forEach((product) => {
            this.addItem(product);
        });
    }

    get name(): string {
        return this._name;
    }

    get document(): string {
        return this._document;
    }

    get Address(): Address {
        return this._address;
    }

    get items(): Product[] {
        return this._items;
    }

    get total(): number {
        return this._items.reduce((total, product) => total + product.price, 0);
    }
}