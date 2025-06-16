import { Request, Response, NextFunction } from "express";
import db from "../config/db";


// COMMENT CRUD

export const createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.session.user) {
            const data = req.body;
            const comment = {
                authorId: req.session.user.id,
                authorUsername: req.session.user.username,
                authorAvatar: req.session.user.avatar,
                postId: data.postId,
                content: data.content
            };

            const q = await db.query(
                'INSERT INTO comments (author_id, author_username, author_avatar, post_id, content) VALUES ($1, $2, $3, $4, $5)',
                [comment.authorId, comment.authorUsername, comment.authorAvatar, comment.postId, comment.content]
            );

            if (q.rowCount > 0) {
                res.status(200).json({
                    ok: true,
                    message: 'Comment created successfully.'
                });
                return;
            } else {
                res.status(500).json({
                    ok: false,
                    error: 'The comment could not be created.'
                });
                return;
            };
        } else {
            res.status(401).json({
                ok: false,
                error: 'You are not authorized to perform this action.'
            });
            return;
        };
    } catch (e) {
        next(e);
    };
};

export const getComments = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = req.body || {};

        const q = await db.query(
            'SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC LIMIT 20',
            [data.postId]
        );

        if (q.rowCount > 0) {
            res.status(200).json({
                ok: true,
                message: 'Comments fetched successfully.',
                data: q.rows
            });
            return;
        } else {
            res.status(404).json({
                ok: false,
                error: 'No comments were found.'
            });
            return;
        };
    } catch (e) {
        next(e);
    };
};

export const updateComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.session.user) {
            const data = req.body;
            const q = await db.query(
                'UPDATE comments SET content = $1 WHERE id = $2 AND author_id = $3',
                [data.content, data.id, req.session.user.id]
            );

            if (q.rowCount > 0) {
                res.status(200).json({
                    ok: true,
                    message: 'Comment updated successfully.'
                });
                return;
            } else {
                res.status(500).json({
                    ok: false,
                    error: 'The comment could not be updated.'
                });
                return;
            };
        } else {
            res.status(401).json({
                ok: false,
                error: 'You are not authorized to perform this action.'
            });
            return;
        };
    } catch (e) {
        next(e);
    };
};

export const deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.session.user) {
            const data = req.body;
            const q = await db.query(
                'DELETE FROM comments WHERE id = $1 AND author_id = $2',
                [data.id, req.session.user.id]
            );

            if (q.rowCount > 0) {
                res.status(200).json({
                    ok: true,
                    message: 'Comment deleted successfully.'
                });
                return;
            } else {
                res.status(500).json({
                    ok: false,
                    error: 'The comment could not be deleted.'
                });
                return;
            };
        } else {
            res.status(401).json({
                ok: false,
                error: 'You are not authorized to perform this action.'
            });
            return;
        };
    } catch (e) {
        next(e);
    };
};