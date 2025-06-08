import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}));
app.use(bodyParser.json());

app.use('/api', authRoutes);

app.listen(5000, () => {
    console.log('Backend running on http://localhost:5000');
});