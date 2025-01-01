
import { Hono } from "hono"
import * as KategoriController from "$controllers/rest/KategoriController"
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as KategoriValidation from "$validations/KategoriValidation";

const KategoriRoutes = new Hono();


KategoriRoutes.get("/",
    KategoriController.getAll
)


KategoriRoutes.get("/:id",
    KategoriController.getById
)


KategoriRoutes.post("/",
    AuthMiddleware.checkJwt, KategoriValidation.validateKategoriDTO, KategoriController.create
)

KategoriRoutes.put("/:id",
    AuthMiddleware.checkJwt, KategoriController.update
)

KategoriRoutes.delete("/",
    KategoriValidation.deleteValidationKatergori, AuthMiddleware.checkJwt, KategoriController.deleteByIds
)

export default KategoriRoutes
