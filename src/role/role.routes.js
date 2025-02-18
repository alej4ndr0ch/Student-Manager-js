import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { saveRole } from "./role.controller.js";

const router = Router();

router.post(
    "/",
    [
        check("role", "El nombre del rol es obligatorio").not().isEmpty(),
        validarCampos
    ],
    saveRole
)

export default router;