import { Router } from "express";
import { createPost, deletePost, getPosts, updatePost, checkStatus, likePost, repostPost, savePost } from "../controllers/postController";

const router = Router();

router.post('/create', createPost);
router.post('/get', getPosts);
router.patch('/update', updatePost);
router.delete('/delete', deletePost);

router.post('/status', checkStatus);

router.post('/like', likePost);
router.post('/repost', repostPost);
router.post('/save', savePost);


export default router;