import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { emailExists, userNameExists, validatePassword} from "../helpers/user-validations.js";
import { userPost, userPut } from "./user.controller.js";


const router = Router();

router.put('/', validarJWT,
    [
        check("username", "enter a username").not().isEmpty(),
        check("username").custom(userNameExists),
        check("password").custom(validatePassword),
        check("firstname", "enter your name").not().isEmpty(),
        check("lastname", "Enter your last name").not().isEmpty(),
        validateFields,
    ], userPut);

router.post(
    "/",
    [
        check("username", "Enter a username").not().isEmpty(),
        check("username").custom(userNameExists),
        check("mail", "This is not a valid email").isEmail(),
        check("mail").custom(emailExists),
        check("password").custom(validatePassword),
        check("firstname", "enter your name").not().isEmpty(),
        check("lastname", "Enter your last name").not().isEmpty(),
        validateFields,
    ], userPost);

export default router;