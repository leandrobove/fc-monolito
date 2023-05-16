import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceProductModel } from "./invoice-product.model";

@Table({
    tableName: "invoices",
    timestamps: false,
})
export class InvoiceModel extends Model {
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

    @Column({ allowNull: false })
    declare addressComplement: string;

    @Column({ allowNull: false })
    declare addressCity: string;

    @Column({ allowNull: false })
    declare addressState: string;

    @Column({ allowNull: false })
    declare addressZipCode: string;

    @HasMany(() => InvoiceProductModel)
    declare items: InvoiceProductModel[];

    @Column({ allowNull: false })
    declare createdAt: Date;

    @Column({ allowNull: false })
    declare updatedAt: Date;
}