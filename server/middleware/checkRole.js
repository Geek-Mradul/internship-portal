// server/middleware/checkRole.js
exports.isCompany = (req, res, next) => {
    if (req.user && req.user.role === 'company') {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: Access denied' });
    }
};