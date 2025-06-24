import jwt from 'jsonwebtoken';

export const protectedRoute = (req, res, next) => {
    const token = req.cookies.token;

    try {
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        req.user = {
            id: decoded.userId,
            role: decoded.role,
            schoolIndex: decoded.schoolIndex,
        };
        console.log("User authenticated:", req);

        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(403).json({ success: false, message: "Forbidden access" });
    }
} 
