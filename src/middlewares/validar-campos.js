import { validationResult } from "express-validator";
//import Posts from "../posts/posts.model.js";
//import Comments from "../comments/comments.model.js";

const validateFields = (req, res, next) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }
    } catch (error) {
        throw error
    }

    next()
}

const validateAuthorToPost = async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const post = await Posts.findById(postId);

        if (post.author_id.toString() !== userId) {
            return res.status(403).json({ error: 'You are not the author of this post' });
        }

        req.post = post;

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const validateAuthorToComment = async (req, res, next) => {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    try {
        const comments = await Comments.findById(commentId);

        if (comments.author_id.toString() !== userId) {
            return res.status(403).json({ error: 'You are not the author of this comment' });
        }
        req.comment = comments;

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//EXPORTA LAS FUNCIONES DEL MIDDLEWARE QUE VALIDA CAMPOS
export { validateFields, validateAuthorToPost, validateAuthorToComment }