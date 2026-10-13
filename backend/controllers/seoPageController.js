import SeoPage from "../models/SeoPage.js";

// Helper to compute on-page SEO audit score (0-100)
const computeSeoScore = ({ title, metaDescription, customH1, targetKeywords, customHeroImage, featuredProducts }) => {
  let score = 0;
  if (title && title.length >= 25 && title.length <= 70) score += 20;
  else if (title) score += 10;

  if (metaDescription && metaDescription.length >= 100 && metaDescription.length <= 165) score += 20;
  else if (metaDescription) score += 10;

  if (customH1 && customH1.length >= 15) score += 20;
  else if (customH1) score += 10;

  if (Array.isArray(targetKeywords) && targetKeywords.length >= 2) score += 20;
  else if (Array.isArray(targetKeywords) && targetKeywords.length > 0) score += 10;

  if (customHeroImage || (Array.isArray(featuredProducts) && featuredProducts.length > 0)) score += 20;
  else score += 10;

  return Math.min(100, Math.max(40, score));
};

// @desc    Get all configured SEO page overrides
// @route   GET /api/seo-pages
export const getAllSeoPages = async (req, res, next) => {
  try {
    const pages = await SeoPage.find().populate("featuredProducts").sort({ updatedAt: -1 });
    res.status(200).json({ success: true, count: pages.length, data: pages });
  } catch (error) {
    next(error);
  }
};

// @desc    Get SEO page override by slug
// @route   GET /api/seo-pages/:slug
export const getSeoPageBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase().trim();
    const stripped = slug.replace(/^sell-/, "").replace(/-in-dubai$/, "").replace(/-dubai$/, "");

    let page = await SeoPage.findOne({
      $or: [
        { slug },
        { slug: `${stripped}-dubai` },
        { slug: `sell-${stripped}-in-dubai` },
        { slug: stripped }
      ]
    }).populate("featuredProducts");

    res.status(200).json({ success: true, data: page || null });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update SEO page configuration
// @route   PUT /api/seo-pages/:slug
export const upsertSeoPage = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase().trim();
    const updateData = { ...req.body, slug };

    // Auto-compute SEO score if not manually set
    if (!updateData.seoScore) {
      updateData.seoScore = computeSeoScore(updateData);
    }

    const page = await SeoPage.findOneAndUpdate(
      { slug },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    ).populate("featuredProducts");

    res.status(200).json({ success: true, message: "SEO page configuration saved successfully", data: page });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload custom hero image to Cloudinary
// @route   POST /api/seo-pages/upload-hero
export const uploadHeroImage = async (req, res, next) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    res.status(200).json({
      success: true,
      imageUrl: req.file.path,
      message: "Hero image uploaded to Cloudinary successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/reset SEO page configuration
// @route   DELETE /api/seo-pages/:slug
export const deleteSeoPage = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase().trim();
    const result = await SeoPage.findOneAndDelete({ slug });

    if (!result) {
      return res.status(404).json({ success: false, message: "SEO configuration not found" });
    }

    res.status(200).json({ success: true, message: "SEO page override reset to defaults" });
  } catch (error) {
    next(error);
  }
};
