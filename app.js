import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import routes from './src/routes/index.js';
import errorHandler from './src/middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Mini Project 2 API',
    version: '1.0.0',
    endpoints: {
      categories: '/api/categories',
      products: '/api/products'
    }
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
});

export default app;
