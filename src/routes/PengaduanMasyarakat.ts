
import { Hono } from "hono"
import * as PengaduanMasyarakatController from "$controllers/rest/PengaduanMasyarakatController"
import * as PengaduanMasyarakatValidation from "$validations/PengaduanMasyarakatValidation"
import * as AuthMiddleware from "$middlewares/authMiddleware";
const PengaduanMasyarakatRoutes = new Hono();


PengaduanMasyarakatRoutes.get("/",
    AuthMiddleware.checkJwt, PengaduanMasyarakatController.getAll
)
// PengaduanMasyarakatRoutes.post("/file",
//     AuthMiddleware.checkJwt,
//     PengaduanMasyarakatController.uploadFile
// );


PengaduanMasyarakatRoutes.get("/:id", AuthMiddleware.checkJwt,
    PengaduanMasyarakatController.getById
)


PengaduanMasyarakatRoutes.post("/",
    PengaduanMasyarakatValidation.validatePengaduanMasyarakatDTO, PengaduanMasyarakatController.create
)

PengaduanMasyarakatRoutes.put("/:id", AuthMiddleware.checkJwt,
    PengaduanMasyarakatController.update
)

PengaduanMasyarakatRoutes.delete("/", AuthMiddleware.checkJwt,
    PengaduanMasyarakatController.deleteByIds
)

export default PengaduanMasyarakatRoutes
