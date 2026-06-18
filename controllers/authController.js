import pool from "../config/db.js";

export const login = async (req, res, next) => {
    console.log("Login Route Hit");
    console.log("Body:", req.body);
    try {
        const {email, password} = req.body;
            const [users] = await pool.execute("SELECT * FROM users WHERE email=? AND password=?", [email, password]);
            if(users.length === 0){
                return res.status(401).json({
                    success: false,
                    message: "Invalid Credentials"
                });
            }
                req.session.user = users[0];
                res.json({
                    success: true,
                    message: "Login Successful"
                });
            
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res, next) => {
    req.session.destroy((err) => {
        if(err){
            return next(err);;
        }
        res.clearCookie("connect.sid");
        res.json({
            success: true,
            message: "Logout Successful"
        });
    });
};

