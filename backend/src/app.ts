import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes'
import assetRouter from './routes/assetRoutes'
import maintenanceLogRouter from './routes/maintenanceLogRoutes'
import maintenanceScheduleRouter from './routes/maintenanceScheduleRoutes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Rota de teste
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Rotas da API
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/assets', assetRouter)
app.use('/api/maintenance-logs', maintenanceLogRouter);
app.use('/api/maintenance-schedules', maintenanceScheduleRouter);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;