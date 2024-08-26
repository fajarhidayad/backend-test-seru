import env from '@/env';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import router from './src/router';
import { errorNotFound, globalErrorHandler } from '@/handler/error.handler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Vehicle API 1.0',
  });
});

app.use('/api', router);

/**
 * Error handler
 * @error
 */
app.use(errorNotFound);
app.use(globalErrorHandler);

const PORT = env.NODE_PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
