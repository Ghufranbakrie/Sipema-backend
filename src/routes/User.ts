
import { Hono } from "hono"
import * as UserController from "$controllers/rest/UserController"
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as UserValidation from "$validations/UserValidation";

const UserRoutes = new Hono();


UserRoutes.get("/",
    AuthMiddleware.checkJwt, UserController.getAll
)


UserRoutes.get("/:id",
    AuthMiddleware.checkJwt, UserController.getById
)


UserRoutes.post("/",
    UserValidation.validateUserRegisterDTO, AuthMiddleware.checkJwt, UserController.create
)

UserRoutes.put("/:id",
    AuthMiddleware.checkJwt, UserController.update
)

UserRoutes.delete("/",
    UserValidation.validationDeletedUsers, AuthMiddleware.checkJwt, UserController.deleteByIds
)

export default UserRoutes
