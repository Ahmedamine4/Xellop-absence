import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import leaveRoutes from './routes/conge.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(bodyParser.json());


app.use('/api/leaves', leaveRoutes);
app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenue sur mon API !');
});


app.listen(5000, () => {
    console.log('Backend running on http://localhost:5000');
});
