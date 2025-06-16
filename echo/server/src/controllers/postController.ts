import { Request, Response, NextFunction } from "express";
import db from "../config/db";


// POST CRUD

export const createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.session.user) {
            const data = req.body;
            const post = {
                authorId: req.session.user.id,
                authorUsername: req.session.user.username,
                authorAvatar: req.session.user.avatar,
                content: data.content
            };

            const q = await db.query(
                'INSERT INTO posts (author_id, author_username, author_avatar, content) VALUES ($1, $2, $3, $4)',
                [post.authorId, post.authorUsername, post.authorAvatar, post.content]
            );

            if (q.rowCount > 0) {
                res.status(200).json({
                    ok: true,
                    message: 'Post created successfully.'
                });
                return;
            } else {
                res.status(500).json({
                    ok: false,
                    error: 'The post could not be created.'
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

export const getPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = req.body || {};
        let q: any;

        if (data.id) {
            q = await db.query('SELECT * FROM posts WHERE id = $1', [data.id]);
        } else if (data.authorId) {
            q = await db.query('SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC', [data.authorId]);
        } else {
            q = await db.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 20');
        };

        if (q.rowCount > 0) {
            res.status(200).json({
                ok: true,
                message: 'Posts retrieved successfully.',
                data: q.rows
            });
            return;
        } else {
            res.status(404).json({
                ok: false,
                error: 'No posts were found.'
            });
            return;
        };
    } catch (e) {
        next(e);
    };
};

export const updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.session.user) {
            const data = req.body;

            if (data.authorId === req.session.user.id) {
                const q = await db.query(
                    'UPDATE posts SET content = $1 WHERE id = $2 AND author_id = $3',
                    [data.content, data.id, req.session.user.id]
                );

                if (q.rowCount > 0) {
                    res.status(200).json({
                        ok: true,
                        message: 'Post updated successfully.'
                    });
                    return;
                } else {
                    res.status(404).json({
                        ok: false,
                        error: 'The post was not found, or you do not have permission to update this post.'
                    });
                    return;
                };
            } else {
                res.status(403).json({
                    ok: false,
                    error: 'You do not have permission to update this post.'
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

export const deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.session.user) {
            const data = req.body;
            console.log(data)

            if (data.authorId === req.session.user.id) {
                const deleteLikes = await db.query(
                    'DELETE FROM likes WHERE post_id = $1',
                    [data.id]
                );
                const deleteReposts = await db.query(
                    'DELETE FROM reposts WHERE post_id = $1',
                    [data.id]
                );
                const deleteSaves = await db.query(
                    'DELETE FROM saves WHERE post_id = $1',
                    [data.id]
                );
                const deletePost = await db.query(
                    'DELETE FROM posts WHERE id = $1 AND author_id = $2',
                    [data.id, req.session.user.id]
                );

                if (deleteLikes.rowCount >= 0 && deleteReposts.rowCount >= 0 && deleteSaves.rowCount >= 0 && deletePost.rowCount > 0) {
                    res.status(200).json({
                        ok: true,
                        message: 'Post deleted successfully.'
                    });
                    return;
                } else {
                    res.status(404).json({
                        ok: false,
                        error: 'The post was not found, or you do not have permission to delete this post.'
                    });
                    return;
                };
            } else {
                res.status(403).json({
                    ok: false,
                    error: 'You do not have permission to delete this post.'
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


// MISC

export const checkStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.session.user) {
            const data = req.body;

            const isLiked = await db.query(
                'SELECT * FROM likes WHERE post_id = $1 AND user_id = $2',
                [data.id, req.session.user.id]
            );
            const isReposted = await db.query(
                'SELECT * FROM reposts WHERE post_id = $1 AND user_id = $2',
                [data.id, req.session.user.id]
            );
            const isSaved = await db.query(
                'SELECT * FROM saves WHERE post_id = $1 AND user_id = $2',
                [data.id, req.session.user.id]
            );
            const author = await db.query(
                'SELECT author_id FROM posts WHERE id = $1',
                [data.id]
            );

            res.status(200).json({
                ok: true,
                is_liked: isLiked.rowCount > 0,
                is_reposted: isReposted.rowCount > 0,
                is_saved: isSaved.rowCount > 0,
                is_author: author.rows[0]?.author_id === req.session.user.id
            });
            return;
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


// POST INTERACTIONS

export const likePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.session.user) {
            const data = req.body;
            console.log(data)

            const postLikes = await db.query(
                'SELECT likes FROM posts WHERE id = $1',
                [data.id]
            );

            if (!data.liked) {
                const updatePostLikes = await db.query(
                    'UPDATE posts SET likes = $1 WHERE id = $2',
                    [postLikes.rows[0].likes + 1, data.id]
                );

                const insertLike = await db.query(
                    'INSERT INTO likes (post_id, user_id) VALUES ($1, $2)',
                    [data.id, req.session.user.id]
                )

                if (updatePostLikes.rowCount > 0) {
                    if (insertLike.rowCount > 0) {
                        res.status(200).json({
                            ok: true,
                            message: 'Post liked successfully.'
                        });
                        return;
                    } else {
                        res.status(500).json({
                            ok: false,
                            error: 'Failed to insert like.'
                        });
                        return;
                    };
                } else {
                    res.status(500).json({
                        ok: false,
                        error: 'Failed to update post likes.'
                    });
                    return;
                };
            } else {
                const updatePostLikes = await db.query(
                    'UPDATE posts SET likes = $1 WHERE id = $2',
                    [postLikes.rows[0].likes - 1, data.id]
                );

                const deleteLike = await db.query(
                    'DELETE FROM likes WHERE post_id = $1 AND user_id = $2',
                    [data.id, req.session.user.id]
                );

                if (updatePostLikes.rowCount > 0) {
                    if (deleteLike.rowCount > 0) {
                        res.status(200).json({
                            ok: true,
                            message: 'Post unliked successfully.'
                        });
                        return;
                    } else {
                        res.status(500).json({
                            ok: false,
                            error: 'Failed to delete like.'
                        });
                        return;
                    };
                } else {
                    res.status(500).json({
                        ok: false,
                        error: 'Failed to update post likes.'
                    });
                    return;
                };
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

export const repostPost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.session.user) {
            const data = req.body;

            const postReposts = await db.query(
                'SELECT reposts FROM posts WHERE id = $1',
                [data.id]
            );

            if (!data.reposted) {
                const updatePostReposts = await db.query(
                    'UPDATE posts SET reposts = $1 WHERE id = $2',
                    [postReposts.rows[0].reposts + 1, data.id]
                );
                const insertRepost = await db.query(
                    'INSERT INTO reposts (post_id, user_id) VALUES ($1, $2)',
                    [data.id, req.session.user.id]
                );

                if (updatePostReposts.rowCount > 0) {
                    if (insertRepost.rowCount > 0) {
                        res.status(200).json({
                            ok: true,
                            message: 'Post reposted successfully.'
                        });
                        return;
                    } else {
                        res.status(500).json({
                            ok: false,
                            error: 'Failed to insert repost.'
                        });
                        return;
                    };
                } else {
                    res.status(500).json({
                        ok: false,
                        error: 'Failed to update post reposts.'
                    });
                    return;
                };
            } else {
                const updatePostReposts = await db.query(
                    'UPDATE posts SET reposts = $1 WHERE id = $2',
                    [postReposts.rows[0].reposts - 1, data.id]
                );
                const deleteRepost = await db.query(
                    'DELETE FROM reposts WHERE post_id = $1 AND user_id = $2',
                    [data.id, req.session.user.id]
                );

                if (updatePostReposts.rowCount > 0) {
                    if (deleteRepost.rowCount > 0) {
                        res.status(200).json({
                            ok: true,
                            message: 'Post un-reposted successfully.'
                        });
                        return;
                    } else {
                        res.status(500).json({
                            ok: false,
                            error: 'Failed to delete repost.'
                        });
                        return;
                    };
                } else {
                    res.status(500).json({
                        ok: false,
                        error: 'Failed to update post reposts.'
                    });
                    return;
                };
            };
        } else {
            res.status(401).json({
                ok: false,
                error: 'You are not authorized to perform this action.'
            });
            return;
        }
    } catch (e) {
        next(e);
    };
};

export const savePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.session.user) {
            const data = req.body;

            const postSaves = await db.query(
                'SELECT saves FROM posts WHERE id = $1',
                [data.id]
            );

            if (!data.saved) {
                const updateSaves = await db.query(
                    'UPDATE posts SET saves = $1 WHERE id = $2',
                    [postSaves.rows[0].saves + 1, data.id]
                )
                const insertSave = await db.query(
                    'INSERT INTO saves (post_id, user_id) VALUES ($1, $2)',
                    [data.id, req.session.user.id]
                );

                if (updateSaves.rowCount > 0) {
                    if (insertSave.rowCount > 0) {
                        res.status(200).json({
                            ok: true,
                            message: 'Post saved successfully.'
                        });
                        return;
                    } else {
                        res.status(500).json({
                            ok: false,
                            error: 'Failed to insert save.'
                        });
                        return;
                    };
                } else {
                    res.status(500).json({
                        ok: false,
                        error: 'Failed to update post saves.'
                    });
                    return;
                };
            } else {
                const updateSaves = await db.query(
                    'UPDATE posts SET saves = $1 WHERE id = $2',
                    [postSaves.rows[0].saves - 1, data.id]
                );
                const deleteSave = await db.query(
                    'DELETE FROM saves WHERE post_id = $1 AND user_id = $2',
                    [data.id, req.session.user.id]
                );

                if (updateSaves.rowCount > 0) {
                    if (deleteSave.rowCount > 0) {
                        res.status(200).json({
                            ok: true,
                            message: 'Post unsaved successfully.'
                        });
                        return;
                    } else {
                        res.status(500).json({
                            ok: false,
                            error: 'Failed to delete save.'
                        });
                        return;
                    };
                } else {
                    res.status(500).json({
                        ok: false,
                        error: 'Failed to update post saves.'
                    });
                    return;
                };
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