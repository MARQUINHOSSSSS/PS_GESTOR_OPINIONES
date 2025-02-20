import { Router } from "express";
import { check } from "express-validator";

import { login } from "./auth.controller.js";
import { validateFields } from "../middlewares/validar-campos.js";

const router = Router()

/**
 * @swagger
 * /opinionmanager/v1/login:
 *   post:
 *     summary: User login to get access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: The user's username or email.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: User successfully logged in and access token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Access token to be used for authenticated requests.
 *       400:
 *         description: Bad request, either missing credentials or invalid data
 *       401:
 *         description: Unauthorized, incorrect username/email or password
 *       500:
 *         description: Internal server error
 */
router.post(
    '/login',
    [
        check('identifier', 'Please enter your username or email.').not().isEmpty(),
        check('password', 'The password is mandatory').not().isEmpty(),
        validateFields,
    ], login)

export default router