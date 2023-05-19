import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { OrderItemModel } from "./order-items.model";

@Table({
    tableName: "orders",
    timestamps: false,
})
export class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @Column({ allowNull: false })
    declare clientId: string;

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