// Simple auth middleware - in production, use JWT
exports.protect = (req, res, next) => {
    // For demo purposes, we'll use a simple header check
    const adminKey = req.headers['admin-key'];
    
    // In production, verify JWT token
    if (adminKey === 'coding-world-admin-2025') {
      next();
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route' 
      });
    }
  };
  
  exports.admin = (req, res, next) => {
    // Additional admin checks if needed
    next();
  };