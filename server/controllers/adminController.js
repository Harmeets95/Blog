import jwt from 'jsonwebtoken';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';

export const adminLogin =async (req,res) => {
    try {
        const {email, password} = req.body;
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({message: "Invalid credentials",success: false});
            
        }
        const token  = jwt.sign({email}, process.env.JWT_SECRET);
         res.json({message: "Login successful", success: true, token});

    } catch (error) {
        res.json({message:error.message, success: false});
    }
}

export const getAllBlogsAdmin =async (req, res) => {
    try {
        const  blogs = await Blog.find({}).sort({createdAt: -1});
        res.json({message: "Blogs fetched successfully", success: true, blogs});
    } catch (error) {
        res.json({message: error.message, success: false});
    }
}

export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({}).populate("blog").sort({createdAt: -1});
        res.json({message: "Comments fetched successfully", success: true, comments});
    } catch (error) {
        res.json({message: error.message, success: false});
    }
}

export const getDashboard =async (req,res) => {
    try {
        const recentBlogs = await Blog.find({}).sort({createdAt: -1}).limit(5);
        const blogs = await Blog.countDocuments()

        const comments = await Comment.countDocuments()
        const drafts = await Blog.countDocuments({isPublished: false});

        const dashboardData = {
            recentBlogs,
            blogs,
            comments,
            drafts
        };

        res.json({message: "Dashboard data fetched successfully", success: true, dashboardData});

    } catch (error) {
        res.json({message: error.message, success: false});
    }
}

export const deleteCommentById = async (req,res) => {
    try {
        const {id} = req.body;

        await Comment.findByIdAndDelete(id)
        res.json({message: "Comment deleted successfully", success: true});


    } catch (error) {
        res.json({message: error.message, success: false});
    }
}

export const approveCommentById = async (req, res) => {
    try {
        const {id} = req.body;
         await Comment.findByIdAndUpdate(id,{isApproved: true});
        res.json({message: "Comment approved successfully", success: true});
    } catch (error) {
        res.json({message: error.message, success: false});
    }
}