import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import main from '../configs/gemini.js';

export const addBlog = async (req, res) => {
    try {
        const {title,subTitle,description,category,isPublished} = JSON.parse(req.body.blog)
        const imageFile = req.file;
        if (!title || !description || !category || !imageFile) {
            return res.json({message: "Please fill all the fields", success: false});
            
        }
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response  = await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder: '/blogs'
        })

        const optimizedImageUrl = imagekit.url({
            path:response.filePath,
            transformation:[{
                quality: 'auto',

            },{
                format:"webp"
            },{
                width:"1280"
            }]
        })

        const image = optimizedImageUrl;

        await Blog.create({
            title,
            subTitle,
            description,
            category,
            image,
            isPublished
        })
        res.json({message: "Blog added successfully", success: true});

    } catch (error) {
        res.json({message: error.message, success: false});
    }
}


export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({isPublished:true});
        res.json({message: "Blogs fetched successfully", success: true, blogs});
    } catch (error) {
        res.json({message: error.message, success: false});
    }
}

export const getBlogById = async (req, res) => {
    try {
        const {blogId} = req.params;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.json({message: "Blog not found", success: false});
        }
        res.json({message: "Blog fetched successfully", success: true, blog});
    } catch (error) {
        res.json({message: error.message, success: false});
    }
}

export const deleteBlogById = async (req, res) => {
    try {
        const {id} = req.body;
      
        await Blog.findByIdAndDelete(id);

        await Comment.deleteMany({blog:id})


        res.json({message: "Blog deleted successfully", success: true});
    } catch (error) {
        res.json({message: error.message, success: false});
    }
}

export const togglePublish = async (req,res) => {
    try {
        const {id} = req.body;
        const blog = await Blog.findById(id)

        blog.isPublished = !blog.isPublished;
        await blog.save();

        res.json({message: "Blog publish status toggled successfully", success: true});

    } catch (error) {
        res.json({message: error.message, success: false});
    }
}

export const addComment = async (req, res) => {
    try {
        const {blog,name,content} = req.body;
        await Comment.create({
            blog,
            name,
            content
        });

        res.json({message: "Comment added for review", success: true});

    } catch (error) {
        res.json({message: error.message, success: false});
    }
}

export const getBlogsComments = async (req, res) => {
    try {
        const {blogId} = req.body;
        const comments = await Comment.find({blog:blogId, isApproved:true}).sort({createdAt: -1});
        res.json({message: "Comments fetched successfully", success: true, comments});

    } catch (error) {
        res.json({message: error.message, success: false});
    }
}

export const generateContent = async (req,res) => {
    try {
        const {prompt} = req.body
      const content =  await main(prompt  + "Generate a blog content for this topic in simple text format");
      res.json({success:true,content})
    } catch (error) {
        res.json({message: error.message, success: false});
        
    }
}