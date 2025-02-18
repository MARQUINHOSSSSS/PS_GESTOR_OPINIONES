import Posts from './posts.model.js';
//import Comment from '../comments/comments.model.js';
import User from '../users/user.model.js';


const createPosts = async (req, res) => {
    const userId = req.user._id;
    const { title, category, text } = req.body;

    try {

        const posts = new Posts({
            title, category, text, author_id: userId,
        });

        await posts.save();

        res.status(201).json({
            posts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
}

const updatePosts = async (req, res) => {
    const { id } = req.params;
    const { _id, author_id, ...rest } = req.body;

    try {
        await Posts.findByIdAndUpdate(id, rest)

        const posts = await Posts.findOne({ _id: id })

        res.status(200).json({
            posts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
};

const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        await Posts.findByIdAndUpdate(id, { state: false });

        const posts = await Posts.findOne({ _id: id });

        res.status(200).json({
            msg: 'Post was successfully deleted',
            posts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
}

const feedPost = async (req, res) => {
    const { limit, offset } = req.query;
    const query = { state: true };

    try {
        const [total, posts] = await Promise.all([
            Posts.countDocuments(query),
            Posts.find(query)
                .skip(Number(offset))
                .limit(Number(limit))
        ]);

        const formattedPosts = posts.map(post => ({
            _id: post._id,
            title: post.title,
            creation_date: new Date(post.creation_date).toISOString().split('T')[0],
        }));

        res.status(200).json({
            total,
            posts: formattedPosts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const postDetails = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Posts.findById(postId);
        const comments = await Comment.find({ postId: postId });

        const postAuthor = await User.findOne({ _id: post.author_id });

        const commentsDetails = await Promise.all(comments
            .filter(comment => comment.status === true)
            .map(async comment => {
                const commentAuthor = await User.findOne({ _id: comment.author_id });
                return {
                    id: comment._id,
                    comment: comment.text,
                    author: commentAuthor.username,
                };
            }));

        const details = {
            post: {
                title: post.title,
                category: post.category,
                text: post.text,
                author: postAuthor.username,
                creation_date: new Date(post.creation_date).toISOString().split('T')[0],
            },
            comments: commentsDetails,
        };

        res.status(200).json({ details });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//EXPORTA LAS FUNCIONES DEL CONTROLADOR
export { createPosts, updatePosts, deletePost, feedPost, postDetails };