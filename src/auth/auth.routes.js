import { Router } from "express";
import { check } from "express-validator";

import { login } from "./auth.controller.js";
import { validateFields } from "../middlewares/validar-campos.js";

const router = Router()

router.post(
    '/login',
    [
        check('identifier', 'Please enter your username or email.').not().isEmpty(),
        check('password', 'The password is mandatory').not().isEmpty(),
        validateFields,
    ], login)

export default router