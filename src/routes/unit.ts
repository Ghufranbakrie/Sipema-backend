
import { Hono } from "hono"
import * as unitController from "$controllers/rest/UnitController"
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as unitValidation from "$validations/UnitValidation";

const unitRoutes = new Hono();


unitRoutes.get("/",
    AuthMiddleware.checkJwt, unitController.getAll
)


unitRoutes.get("/:id",
    AuthMiddleware.checkJwt, unitController.getById
)


unitRoutes.post("/",
    AuthMiddleware.checkJwt, unitValidation.validateUnitCreateDTO, unitController.create
)

unitRoutes.put("/:id",
    AuthMiddleware.checkJwt, unitController.update
)

unitRoutes.delete("/",
    AuthMiddleware.checkJwt, unitController.deleteByIds
)

export default unitRoutes
