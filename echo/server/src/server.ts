import cors from 'cors';
import express from 'express';
import session from 'express-session';

import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';

import config from './config/config';

const app = express();

app.use(cors({
    origin: config.client,
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: config.secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 30 * 60 * 1000, //1 day
        sameSite: 'lax',
        secure: config.nodeEnv === 'development' ? false : true
    }
}));

app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);


app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});