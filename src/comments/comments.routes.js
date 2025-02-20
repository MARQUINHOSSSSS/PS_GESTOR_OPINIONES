import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validateFields, validateAuthorToComment } from "../middlewares/validar-campos.js";
import { existingPost } from "../helpers/posts-validations.js";
import { existingComment } from "../helpers/comment-validations.js";
import { createComment, deleteComment, updateComment } from "./comments.controller.js";

const router = Router();

/**
 * @swagger
 * /opinionmanager/v1/posts/{postId}/comments:
 *   post:
 *     summary: Create a comment on a specific post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
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
 *               text:
 *                 type: string
 *                 description: The content of the comment
 *     responses:
 *       201:
 *         description: Comment successfully created
 *       400:
 *         description: Invalid data or bad request
 *       401:
 *         description: Unauthorized (missing or invalid JWT)
 *       404:
 *         description: Post not found
 */
router.post('/:postId',
    validarJWT,
    [
        check("postId", "The id is not a valid MongoDB format").isMongoId(),
        check("postId").custom(existingPost),
        validateFields,
    ], createComment);

/**
 * @swagger
 * /opinionmanager/v1/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: mongoid
 *     responses:
 *       200:
 *         description: Comment successfully deleted
 *       401:
 *         description: Unauthorized (missing or invalid JWT)
 *       403:
 *         description: Forbidden (not authorized to delete comment)
 *       404:
 *         description: Comment not found
 */
router.delete('/:commentId',
    validarJWT,
    [
        check("commentId", "The id is not a valid MongoDB format").isMongoId(),
        check("commentId").custom(existingComment),
        validateFields,
        validateAuthorToComment,
    ], deleteComment);

/**
 * @swagger
 * /opinionmanager/v1/comments/{commentId}:
 *   put:
 *     summary: Update a comment by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
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
 *               text:
 *                 type: string
 *                 description: The updated content of the comment
 *     responses:
 *       200:
 *         description: Comment successfully updated
 *       400:
 *         description: Invalid data or bad request
 *       401:
 *         description: Unauthorized (missing or invalid JWT)
 *       403:
 *         description: Forbidden (not authorized to update comment)
 *       404:
 *         description: Comment not found
 */
router.put('/:commentId',
    validarJWT,
    [
        check("commentId", "The id is not a valid MongoDB format").isMongoId(),
        check("commentId").custom(existingComment),
        validateFields,
        validateAuthorToComment,
    ], updateComment);

export default router;