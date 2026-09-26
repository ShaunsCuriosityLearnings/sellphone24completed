import express from "express";
import {
  getAllSeoPages,
  getSeoPageBySlug,
  upsertSeoPage,
  uploadHeroImage,
  deleteSeoPage,
} from "../controllers/seoPageController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.route("/")
  .get(getAllSeoPages);

router.route("/upload-hero")
  .post(upload.single("heroImage"), uploadHeroImage);

router.route("/:slug")
  .get(getSeoPageBySlug)
  .put(upsertSeoPage)
  .delete(deleteSeoPage);

export default router;
