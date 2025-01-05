import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('Auth Header:', authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Not Authorized, login again'
            });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token:', token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded:', decoded);

        // Add user info to request
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

export default authMiddleware;
