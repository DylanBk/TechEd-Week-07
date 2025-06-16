import { Request, Response, NextFunction } from "express";
import db from '../config/db';
import encryptPw from '../utils/encryptPw';
import checkPw from '../utils/checkPw';


// USER CRUD

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = req.body;

        if (!await userExists({email: data.email}, next)) {
            if (!await userExists({username: data.username}, next)) {
                data.password = await encryptPw(data.password);

                const q = await db.query(
                    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
                    [data.username, data.email, data.password]
                );

                if (q.rowCount && q.rowCount > 0) {
                    res.status(200).json({
                        ok: true,
                        message: 'User created successfully.',
                    });
                    return;
                } else {
                    res.status(500).json({
                        ok: false,
                        error: 'The user could not be created.'
                    });
                    return;
                };
            } else {
                res.status(409).json({
                    ok: false,
                    error: 'This username is already taken.'
                });
                return;
            };
        } else {
            res.status(409).json({
                ok: false,
                error: 'This email is already taken.'
            });
            return;
        };
    } catch (e) {
        next(e);
    };
};

export const getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.session.user) {
            const q = await db.query(
                'SELECT * FROM users WHERE id = $1',
                [req.session.user.id]
            );

            if (q.rowCount > 0) {
                const user = {
                    id: q.rows[0].id,
                    username: q.rows[0].username,
                    email: q.rows[0].email,
                    role: q.rows[0].role,
                    avatar: q.rows[0].avatar,
                    createdAt: q.rows[0].created_at
                };

                res.status(200).json({
                    ok: true,
                    message: 'User data fetched successfully.',
                    data: user
                });
                return;
            } else {
                res.status(404).json({
                    ok: false,
                    error: 'The user was not found.'
                });
                return;
            };
        } else {
            const data = req.body;
            let q: any;

            if (data.id) {
                q = await db.query(
                    'SELECT * FROM users WHERE id = $1',
                    [data.id]
                );
            } else if (data.email) {
                q = await db.query(
                    'SELECT * FROM users WHERE email = $1',
                    [data.email]
                );
            } else if (data.username) {
                q = await db.query(
                    'SELECT * FROM users WHERE username = $1',
                    [data.username]
                );
            } else {
                res.status(400).json({
                    ok: false,
                    error: 'No identifier was provided.'
                });
                return;
            };

            if (q && q.rowCount > 0) {
                const user = {
                    id: q.rows[0].id,
                    username: q.rows[0].username,
                    email: q.rows[0].email,
                    role: q.rows[0].role,
                    avatar: q.rows[0].avatar,
                    createdAt: q.rows[0].created_at
                };

                res.status(200).json({
                    ok: true,
                    message: 'User data fetched successfully.',
                    data: user
                });
                return;
            } else {
                res.status(404).json({
                    ok: false,
                    error: 'The user was not found.'
                });
                return;
            };
        };
    } catch (e) {
        next(e);
    };
};

export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.session.user) {
            const data = req.body;
            const user = await db.query(
                'SELECT * FROM users WHERE id = $1',
                [req.session.user.id]
            );

            if (await checkPw(data.password, user.rows[0].password)) {
                const q = await db.query(
                    `UPDATE users SET ${data.column} = $1 WHERE id = $2`,
                    [data.value, req.session.user.id]
                );

                if (q.rowCount > 0) {
                    req.session.user[data.column] = data.value;
                    res.status(200).json({
                        ok: true,
                        message: 'User updated successfully.',
                    });
                    return;
                } else {
                    res.status(500).json({
                        ok: false,
                        error: 'The user could not be updated.'
                    });
                    return;
                };
            } else {
                res.status(401).json({
                    ok: false,
                    error: 'The password you entered is incorrect.'
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

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.session.user) {
            const data = req.body;
            const user = await db.query(
                'SELECT * FROM users WHERE id = $1',
                [req.session.user.id]
            );

            if (await checkPw(data.password, user.rows[0].password)) {
                const q = await db.query(
                    'DELETE FROM users WHERE id = $1',
                    [req.session.user.id]
                );

                if (q.rowCount > 0) {
                    req.session.destroy((err) => {
                        if (err) {
                            res.status(500).json({
                                ok: false,
                                error: 'The session could not be destroyed.'
                            });
                            return;
                        } else {
                            res.status(200).json({
                                ok: true,
                                message: 'User deleted successfully.'
                            });
                            return;
                        };
                    });
                } else {
                    res.status(500).json({
                        ok: false,
                        error: 'The user could not be deleted.'
                    });
                    return;
                };
            } else {
                res.status(401).json({
                    ok: false,
                    error: 'The password you entered is incorrect.'
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


// USER AUTH

export const userExists = async (
    options: {
        id?: number,
        email?: string,
        username?: string
    },
    next: NextFunction
) => {
    try {
        let q: any;

        if (options.id) {
            q = await db.query(
                'SELECT * FROM users WHERE id = $1',
                [options.id])
        } else if (options.email) {
            q = await db.query(
                'SELECT * FROM users WHERE email = $1',
                [options.email]
            );
        } else if (options.username) {
            q = await db.query(
                'SELECT * FROM users WHERE username = $1',
                [options.username]
            );
        };
        return q && q.rowCount > 0;
    } catch (e) {
        next(e);
    };
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.session.user) {
            res.status(400).json({
                ok: false,
                error: 'You are already logged in.'
            });
            return;
        };
        const data = req.body;

        if (await userExists({email: data.email}, next)) {
            const user = await db.query(
                'SELECT * FROM users WHERE email = $1',
                [data.email]
            );

            if (await checkPw(data.password, user.rows[0].password)) {
                req.session.user = {
                    id: user.rows[0].id,
                    username: user.rows[0].username,
                    email: user.rows[0].email,
                    role: user.rows[0].role,
                    avatar: user.rows[0].avatar,
                    createdAt: user.rows[0].created_at
                };
                res.status(200).json({
                    ok: true,
                    message: 'User logged in successfully.',
                });
                return;
            } else {
                res.status(401).json({
                    ok: false,
                    error: 'The password you entered is incorrect.'
                });
                return;
            }
        } else {
            res.status(404).json({
                ok: false,
                error: 'The user was not found.'
            });
            return;
        };
    } catch (e) {
        next(e);
    };
};