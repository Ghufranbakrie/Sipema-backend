
import {Hono} from "hono"
import * as PengaduanController from "$controllers/rest/PengaduanController"

const PengaduanRoutes = new Hono();


PengaduanRoutes.get("/",
    PengaduanController.getAll
)


PengaduanRoutes.get("/:id",
    PengaduanController.getById
)


PengaduanRoutes.post("/",
    PengaduanController.create
)

PengaduanRoutes.put("/:id",
    PengaduanController.update
)

PengaduanRoutes.delete("/",
    PengaduanController.deleteByIds
)

export default PengaduanRoutes
