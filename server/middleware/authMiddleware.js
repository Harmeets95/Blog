import jwt from 'jsonwebtoken';


const auth = (req, res, next) => {
    const token = req.headers.authorization
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.json({
            message: "Invalid token",
            success: false,
        });
    }

}
export default auth;