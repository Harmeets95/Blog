import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getBlogById,
  getBlogsComments,
  togglePublish,
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/authMiddleware.js";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete", auth, deleteBlogById);
blogRouter.post("/toggle-publish", auth, togglePublish);
blogRouter.post("/add-comment",addComment)
blogRouter.post("/comments",getBlogsComments)
blogRouter.post("/generate", auth, generateContent)


export default blogRouter;
