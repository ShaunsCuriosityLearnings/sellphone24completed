import Category from "../models/Category.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Admin
export const createCategory = async (req, res) => {
  try {
    let { name, slug, description, image } = req.body;
    if (req.file) {
      image = req.file.path;
    }
    
    // Check for duplicate slug manually to provide a clear error message
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: `A category with the slug "${slug}" already exists. Please use a unique slug.` });
    }

    const newCategory = await Category.create({ name, slug, description, image });
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: `A category with this slug already exists. Please use a unique slug.` });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let dataToUpdate = { ...req.body };
    
    if (req.file) {
      dataToUpdate.image = req.file.path;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, dataToUpdate, {
      new: true,
      runValidators: true,
    });
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: `A category with this slug already exists. Please use a unique slug.` });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
