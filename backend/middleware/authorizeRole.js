export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log(req.user);
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }
        next();
    };
};