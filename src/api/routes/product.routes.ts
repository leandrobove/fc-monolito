import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../modules/store-catalog/factory/facade.factory";

export const productRouter = express.Router();

productRouter.post("/", async (req: Request, res: Response) => {
    const facade = ProductAdmFacadeFactory.create();
    try {
        const input = {
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock,
        }

        const output = await facade.addProduct(input);
        res.status(201).send(output);
    } catch (error) {
        res.send(500).send(error);
    }
});

productRouter.get("/", async (req: Request, res: Response) => {
    const facade = StoreCatalogFacadeFactory.create();
    try {
        const output = await facade.findAll();
        res.status(200).send(output);
    } catch (error) {
        res.status(500).send(error);
    }
});