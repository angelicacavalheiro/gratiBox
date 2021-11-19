import express from 'express';
import cors from 'cors';
import singUp from './controllers/signUp/signUp.js';
import signIn from './controllers/signIn/signIn.js';
import { adressPost, adressGet } from './controllers/adress/adress.js';
import { planPost, planGet } from './controllers/plan/plan.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/status', (req, res) => {
  // Manda como resposta o texto 'Hello World'
  res.send('Server online');
});

app.post('/sign-up', singUp);
app.post('/sign-in', signIn);

app.post('/adress', adressPost);
app.get('/adress', adressGet);

app.post('/plan', planPost);
app.get('/plan', planGet);

export default app;
