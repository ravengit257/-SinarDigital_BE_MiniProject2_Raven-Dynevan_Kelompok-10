import prisma from '../utils/prismaClient.js';
import { successResponse } from '../utils/helpers.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(successResponse('Categories retrieved successfully', categories));
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: true,
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json(successResponse('Category retrieved successfully', category));
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description
      }
    });

    res.status(201).json(successResponse('Category created successfully', category));
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description })
      }
    });

    res.json(successResponse('Category updated successfully', category));
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (existingCategory._count.products > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${existingCategory._count.products} products. Please delete or reassign products first.`
      });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    res.json(successResponse('Category deleted successfully', null));
  } catch (error) {
    next(error);
  }
};