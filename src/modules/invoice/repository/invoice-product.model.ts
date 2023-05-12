import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
    tableName: "invoices_products",
    timestamps: false,
})
export default class InvoiceProductModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare price: number;

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false })
    invoice_id: string;

    @BelongsTo(() => InvoiceModel)
    invoice: InvoiceModel;
}