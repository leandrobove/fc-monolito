import { BelongsToMany, Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import ProductModel from "./product.model";
import InvoiceProductModel from "./invoice-product.model";

@Table({
    tableName: "invoices",
    timestamps: false,
})
export default class InvoiceModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare document: string;

    @Column({ allowNull: false })
    declare addressStreet: string;

    @Column({ allowNull: false })
    declare addressNumber: string;

    @Column({})
    declare addressComplement: string;

    @Column({ allowNull: false })
    declare addressCity: string;

    @Column({ allowNull: false })
    declare addressState: string;

    @Column({ allowNull: false })
    declare addressZipCode: string;

    @BelongsToMany(() => ProductModel, {
        through: { model: () => InvoiceProductModel },
    })
    declare items: ProductModel[];

    @HasMany(() => InvoiceProductModel)
    declare invoiceProducts: InvoiceProductModel[];

    @Column({ allowNull: false })
    declare createdAt: Date;

    @Column({ allowNull: false })
    declare updatedAt: Date;
}