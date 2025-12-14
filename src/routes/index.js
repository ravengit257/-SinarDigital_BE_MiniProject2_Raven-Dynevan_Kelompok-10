import express from 'express';
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';

const router = express.Router();

// API Info
router.get('/', (req, res) => {
  res.json({
    message: 'Mini Project 2 API',
    version: '1.0.0',
    endpoints: {
      categories: {
        getAll: 'GET /api/categories',
        getById: 'GET /api/categories/:id',
        create: 'POST /api/categories',
        update: 'PUT /api/categories/:id',
        delete: 'DELETE /api/categories/:id'
      },
      products: {
        getAll: 'GET /api/products (supports ?page=1&limit=10)',
        getById: 'GET /api/products/:id',
        create: 'POST /api/products (with image upload)',
        update: 'PUT /api/products/:id (with image upload)',
        delete: 'DELETE /api/products/:id'
      }
    }
  });
});

// Mount routes
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

export default router;