import Comment from './comments.model.js';
import Posts from '../posts/posts.model.js';
import User from '../users/user.model.js';

const createComment = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;
    const { text } = req.body;

    try {
        const post = await Posts.findOne({ _id: postId });

        const comment = new Comment({
            postId, text, author_id: userId,
        });

        await comment.save();


        const postAuthor = await User.findOne({ _id: post.author_id });
        const commentAuthor = await User.findOne({ _id: comment.author_id });

        const data = {
            post: {
                title: post.title,
                category: post.category,
                text: post.text,
                author: postAuthor.username,
                creation_date: new Date(post.creation_date).toISOString().split('T')[0],
            },
            comment: {
                comment: comment.text,
                author: commentAuthor.username,
            }

        };

        res.status(201).json({
            data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
}
const deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    try {
        await Comment.findByIdAndUpdate(commentId, { status: false });

        const comment = await Comment.findOne({ _id: commentId });

        res.status(200).json({
            msg: 'comment was successfully deleted',
            comment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }

}


const updateComment = async (req, res) => {
    const commentId = req.params.commentId;
    const { _id, author_id, ...rest } = req.body;

    try {
        await Comment.findByIdAndUpdate(commentId, rest)

        const comment = await Comment.findOne({ _id: commentId })

        res.status(200).json({
            comment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
}

//EXPORTA LAS FUNCIONES DE COMENTARIOS PARA PODER USARLAS EN OTROS ARCHIVOS
export { createComment, deleteComment, updateComment }