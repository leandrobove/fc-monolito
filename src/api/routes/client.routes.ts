import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../modules/client-adm/factory/client-adm.facade.factory";

export const clientRouter = express.Router();

clientRouter.post("/", async (req: Request, res: Response) => {
    const facade = ClientAdmFacadeFactory.create();
    try {
        await facade.add({
            id: req.body.id || null,
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
        });
        res.status(201).send();
    } catch (error) {
        res.status(500).send(error);
    }
});

clientRouter.get("/:id", async (req: Request, res: Response) => {
    const facade = ClientAdmFacadeFactory.create();
    try {
        const output = await facade.find({ id: req.params.id });
        res.status(200).send(output);
    } catch (error) {
        res.status(500).send(error);
    }
});