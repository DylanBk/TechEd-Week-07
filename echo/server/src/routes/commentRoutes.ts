import { Router } from "express";
import { createComment, deleteComment, getComments, updateComment } from "../controllers/commentController";

const router = Router();


router.post('/create', createComment);
router.post('/get', getComments);
router.patch('/update', updateComment);
router.delete('/delete', deleteComment);


export default router;