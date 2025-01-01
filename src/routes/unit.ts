
import { Hono } from "hono"
import * as unitController from "$controllers/rest/UnitController"
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as unitValidation from "$validations/UnitValidation";
import { Roles } from "@prisma/client";

const unitRoutes = new Hono();


unitRoutes.get("/",
    unitController.getAll
)


unitRoutes.get("/:id",
    unitController.getById
)


unitRoutes.post("/",
    AuthMiddleware.checkJwt, AuthMiddleware.checkRole([Roles.ADMIN]), unitValidation.validateUnitCreateDTO, unitController.create
)

unitRoutes.put("/:id",
    unitValidation.validateUnitUpdateDTO, AuthMiddleware.checkJwt, unitController.update
)

unitRoutes.delete("/",
    unitValidation.validationDeletedUnit, AuthMiddleware.checkJwt, unitController.deleteByIds
)

export default unitRoutes
