import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import pool from './db.js';


dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5000',
}));
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
});


app.post('/usernamecheck', async (req, res) => {
    if (req.method === 'POST') {
        const data = req.body;

        const q = await pool.query(
            'SELECT * FROM "Users" WHERE username = $1',
            [data.username]
        );

        if (q.rowCount === 1) {
            res.status(400).json({
                ok: false,
                error: "This username is already taken"
            });
            return;
        } else {
            res.status(200).json({
                ok: true,
                message: 'This username is available'
            });
            return;
        }
    } else {
        res.status(405).json({
            ok: false,
            error: 'Method Not Allowed'
        });
        return;
    };
});