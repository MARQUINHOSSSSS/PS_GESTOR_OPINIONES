import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validateFields, validateAuthorToComment } from "../middlewares/validar-campos.js";
import { existingPost } from "../helpers/posts-validations.js";
import { existingComment } from "../helpers/comment-validations.js";
import { createComment, deleteComment, updateComment } from "./comments.controller.js";

const router = Router();


router.post('/:postId',
    validarJWT,
    [
        check("postId", "The id is not a valid MongoDB format").isMongoId(),
        check("postId").custom(existingPost),
        validateFields,
    ], createComment);

router.delete('/:commentId',
    validarJWT,
    [
        check("commentId", "The id is not a valid MongoDB format").isMongoId(),
        check("commentId").custom(existingComment),
        validateFields,
        validateAuthorToComment,
    ], deleteComment);


router.put('/:commentId',
    validarJWT,
    [
        check("commentId", "The id is not a valid MongoDB format").isMongoId(),
        check("commentId").custom(existingComment),
        validateFields,
        validateAuthorToComment,
    ], updateComment);

export default router;