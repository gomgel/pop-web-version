import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server is running');
});

app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
