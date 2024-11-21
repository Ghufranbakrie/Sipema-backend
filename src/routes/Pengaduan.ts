
import { Hono } from "hono"
import * as PengaduanController from "$controllers/rest/PengaduanController"
import * as authMiddleware from "$middlewares/authMiddleware"
import * as pengaudanValidation from "$validations/PengaduanValidation"
import { Roles } from "@prisma/client";

const PengaduanRoutes = new Hono();


PengaduanRoutes.get("/",
    authMiddleware.checkJwt, authMiddleware.checkRole([Roles.PETUGAS_SUPER]), PengaduanController.getAll
)

PengaduanRoutes.get("/my-complaints",
    authMiddleware.checkJwt,
    authMiddleware.checkRole([Roles.USER]),
    PengaduanController.getAllByUser
);

PengaduanRoutes.get("/unit-complaints",
    authMiddleware.checkJwt,
    authMiddleware.checkRole([Roles.PETUGAS]),
    PengaduanController.getAllByUnit
);



PengaduanRoutes.get("/:id",
    authMiddleware.checkJwt, authMiddleware.checkRole([Roles.PETUGAS, Roles.USER, Roles.PETUGAS_SUPER]), PengaduanController.getById
)


PengaduanRoutes.post("/",
    authMiddleware.checkJwt, authMiddleware.checkRole([Roles.USER]), pengaudanValidation.validatePengaduanDTO, PengaduanController.create
)

PengaduanRoutes.put("/:id",
    authMiddleware.checkJwt, authMiddleware.checkRole([Roles.PETUGAS, Roles.PETUGAS_SUPER]), PengaduanController.update
)

PengaduanRoutes.delete("/",
    authMiddleware.checkJwt, authMiddleware.checkRole([Roles.PETUGAS, Roles.PETUGAS_SUPER]), PengaduanController.deleteByIds
)

export default PengaduanRoutes
