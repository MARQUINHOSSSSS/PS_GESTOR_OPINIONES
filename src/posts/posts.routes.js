import { Router } from "express";
import { check } from "express-validator";
import { validateFields, validateAuthorToPost } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existingPost } from "../helpers/posts-validations.js";
import { createPosts, updatePosts, deletePost, feedPost, postDetails } from "./posts.controller.js";


const router = Router();

/**
 * @swagger
 * /opinionmanager/v1/posts:
 *   get:
 *     summary: Retrieve a list of posts
 *     responses:
 *       200:
 *         description: A list of posts
 */
router.get('/', feedPost);

/**
 * @swagger
 * /opinionmanager/v1/posts/{postId}:
 *   get:
 *     summary: Retrieve a post by its ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoid
 *     responses:
 *       200:
 *         description: A post object
 *       404:
 *         description: Post not found
 */
router.get('/:postId',
    [
        check("postId", "The id is not a valid MongoDB format").isMongoId(),
        check("postId").custom(existingPost),
        validateFields,
    ], postDetails);

/**
 * @swagger
 * /opinionmanager/v1/posts:
 *   post:
 *     summary: Create a new post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post successfully created
 *       400:
 *         description: Invalid data or bad request
 *       401:
 *         description: Unauthorized (missing or invalid JWT)
 */
router.post('/',
    validarJWT,
    [
        check("title", "Obligatory field").not().isEmpty(),
        check("category"),
        check("text"),
        validateFields,
    ], createPosts);

/**
 * @swagger
 * /opinionmanager/v1/posts/{id}:
 *   put:
 *     summary: Update an existing post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post successfully updated
 *       400:
 *         description: Invalid data or bad request
 *       401:
 *         description: Unauthorized (missing or invalid JWT)
 *       403:
 *         description: Forbidden (not authorized to edit post)
 *       404:
 *         description: Post not found
 */
router.put('/:id', validarJWT,
    [
        check("id", "The id is not a valid MongoDB format").isMongoId(),
        check("id").custom(existingPost),
        validateFields,
        validateAuthorToPost,
    ], updatePosts);


/**
 * @swagger
 * /opinionmanager/v1/posts/{id}:
 *   delete:
 *     summary: Delete a post by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoid
 *     responses:
 *       200:
 *         description: Post successfully deleted
 *       401:
 *         description: Unauthorized (missing or invalid JWT)
 *       403:
 *         description: Forbidden (not authorized to delete post)
 *       404:
 *         description: Post not found
 */
router.delete('/:id', validarJWT,
    [
        check("id", "The id is not a valid MongoDB format").isMongoId(),
        check("id").custom(existingPost),
        validateFields,
        validateAuthorToPost,
    ], deletePost);

export default router;