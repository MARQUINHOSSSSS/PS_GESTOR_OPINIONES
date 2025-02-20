import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { emailExists, userNameExists, validatePassword} from "../helpers/user-validations.js";
import { userPost, userPut } from "./user.controller.js";


const router = Router();

/**
 * @swagger
 * /opinionmanager/v1/user:
 *   put:
 *     summary: Update an existing user's information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully updated
 *       400:
 *         description: Invalid data or bad request
 *       401:
 *         description: Unauthorized access (missing or invalid JWT)
 *       500:
 *         description: Internal server error
 */
router.put('/', validarJWT,
    [
        check("username", "enter a username").not().isEmpty(),
        check("username").custom(userNameExists),
        check("password").custom(validatePassword),
        check("firstname", "enter your name").not().isEmpty(),
        check("lastname", "Enter your last name").not().isEmpty(),
        validateFields,
    ], userPut);

/**
 * @swagger
 * /opinionmanager/v1/user:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               mail:
 *                 type: string
 *               password:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: Invalid data or bad request
 *       409:
 *         description: Username or email already exists
 *       500:
 *         description: Internal server error
 */
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