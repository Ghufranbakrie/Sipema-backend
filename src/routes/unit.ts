
import { Hono } from "hono"
import * as unitController from "$controllers/rest/UnitController"

const unitRoutes = new Hono();


unitRoutes.get("/",
    unitController.getAll
)


unitRoutes.get("/:id",
    unitController.getById
)


unitRoutes.post("/",
    unitController.create
)

unitRoutes.put("/:id",
    unitController.update
)

unitRoutes.delete("/",
    unitController.deleteByIds
)

export default unitRoutes
