import prisma from '../utils/prismaClient.js';
import { successResponse, deleteFile, getPaginationMeta } from '../utils/helpers.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.product.count()
    ]);

    const pagination = getPaginationMeta(total, page, limit);

    res.json(successResponse('Products retrieved successfully', {
      products,
      pagination
    }));
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json(successResponse('Product retrieved successfully', product));
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;
    const image = req.file ? req.file.path : null;

    if (!name || !price || !categoryId) {
      if (image) deleteFile(image);
      return res.status(400).json({
        success: false,
        message: 'Name, price, and categoryId are required'
      });
    }

    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) }
    });

    if (!category) {
      if (image) deleteFile(image);
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        image,
        categoryId: parseInt(categoryId)
      },
      include: {
        category: true
      }
    });
    
    res.status(201).json(successResponse('Product created successfully', product));
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId } = req.body;
    const newImage = req.file ? req.file.path : null;

    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProduct) {
      if (newImage) deleteFile(newImage);
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) }
      });

      if (!category) {
        if (newImage) deleteFile(newImage);
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    if (newImage && existingProduct.image) {
      deleteFile(existingProduct.image);
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(newImage && { image: newImage }),
        ...(categoryId && { categoryId: parseInt(categoryId) })
      },
      include: {
        category: true
      }
    });

    res.json(successResponse('Product updated successfully', product));
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (existingProduct.image) {
      deleteFile(existingProduct.image);
    }

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json(successResponse('Product deleted successfully', null));
  } catch (error) {
    next(error);
  }
};