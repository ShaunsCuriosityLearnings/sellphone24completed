import Blog from "../models/Blog.js";

// @desc    Get all blogs (optional search/category filtering)
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const { cat, search } = req.query;
    let query = {};

    if (cat && cat !== "all") {
      // Map frontend category slugs to database category values
      const categoryMap = {
        "buying-guides": "Buying Guides",
        "recycling-tips": "Recycling Tips",
        "price-analysis": "Price Analysis",
      };
      const mappedCategory = categoryMap[cat] || cat;
      query.category = mappedCategory;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs", error: error.message });
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug.toLowerCase() });
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    // Increment view count
    blog.views = (blog.views || 0) + 1;
    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog post", error: error.message });
  }
};

// @desc    Create a blog post
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
  try {
    let { title, slug, desc, content, img, category, author } = req.body;

    if (req.file) {
      img = req.file.path;
    }

    if (!title || !slug || !desc || !content || !category) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    // Verify slug uniqueness
    const slugExists = await Blog.findOne({ slug: slug.toLowerCase() });
    if (slugExists) {
      return res.status(400).json({ message: "A blog post with this slug already exists" });
    }

    const blog = await Blog.create({
      title,
      slug: slug.toLowerCase(),
      desc,
      content,
      img,
      category,
      author: author || "Team SellYourPhone24",
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog post", error: error.message });
  }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  try {
    let { title, slug, desc, content, img, category, author } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    if (req.file) {
      img = req.file.path;
    }

    if (slug && slug.toLowerCase() !== blog.slug) {
      const slugExists = await Blog.findOne({ slug: slug.toLowerCase() });
      if (slugExists) {
        return res.status(400).json({ message: "A blog post with this slug already exists" });
      }
      blog.slug = slug.toLowerCase();
    }

    blog.title = title || blog.title;
    blog.desc = desc || blog.desc;
    blog.content = content || blog.content;
    blog.img = img || blog.img;
    blog.category = category || blog.category;
    blog.author = author || blog.author;

    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog post", error: error.message });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    await Blog.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog post", error: error.message });
  }
};
