import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderItemModel from "./order-items.model";
import { ClientModel } from "./client.model";

@Table({
    tableName: "orders",
    timestamps: false,
})
export default class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @ForeignKey(() => ClientModel)
    @Column({ allowNull: false })
    declare clientId: string;

    @BelongsTo(() => ClientModel)
    declare client: ClientModel;

    @Column({ allowNull: true })
    declare invoiceId: string;

    @Column({ allowNull: false })
    declare status: string;

    @HasMany(() => OrderItemModel)
    declare items: OrderItemModel[];

    @Column({ allowNull: false })
    declare total: number;

    @Column({ allowNull: false })
    declare createdAt: Date;

    @Column({ allowNull: false })
    declare updatedAt: Date;
}