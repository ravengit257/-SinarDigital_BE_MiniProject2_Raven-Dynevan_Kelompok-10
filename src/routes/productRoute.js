import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { uploadSingle } from '../middlewares/upload.js';

const router = express.Router();
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', uploadSingle('image'), createProduct);
router.put('/:id', uploadSingle('image'), updateProduct);
router.delete('/:id', deleteProduct);

export default router;