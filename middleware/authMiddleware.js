const authMiddleware = (req, res, next) => {
    if(!req.session.user){
        return res.status(401).json({
            success: false,
            message: "Please Login First"
        });
    }
    next();
};
export default authMiddleware;