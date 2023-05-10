import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import ProductModel from "./product.model";

@Table({
    tableName: "invoice_product",
    timestamps: false,
})
export default class InvoiceProductModel extends Model {
    @BelongsTo(() => InvoiceModel)
    declare invoice: InvoiceModel;

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false })
    declare invoiceId: string;

    @BelongsTo(() => ProductModel)
    declare product: ProductModel;

    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false })
    declare productId: string;
}