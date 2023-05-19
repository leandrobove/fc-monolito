import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object"

type ProductProps = {
    id?: Id;
    name: string;
    description: string;
    salesPrice: number;
    productId: string;
};

export default class OrderItem extends BaseEntity {
    private _name: string;
    private _description: string;
    private _salesPrice: number;
    private _productId: string;

    constructor(props: ProductProps) {
        super(props.id);
        this._name = props.name;
        this._description = props.description;
        this._salesPrice = props.salesPrice;
        this._productId = props.productId;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get salesPrice(): number {
        return this._salesPrice;
    }

    get productId(): string {
        return this._productId;
    }
}