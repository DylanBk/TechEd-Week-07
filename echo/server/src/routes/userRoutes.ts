import { Router } from "express";
import { createUser, deleteUser, getUser, login, updateUser } from "../controllers/userController";
import { updatePost } from "../controllers/postController";


const router = Router();

router.post('/create', createUser);
router.post('/get', getUser);
router.patch('/update', updateUser);
router.delete('/delete', deleteUser);

router.post('/signup', createUser);
router.post('/login', login);



export default router;