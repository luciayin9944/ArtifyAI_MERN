import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    const headerToken = auth && auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;

    const token = headerToken || req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('JWT Error:', err.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default authUser;










// import jwt from 'jsonwebtoken'; 

// // User authentication middleware
// const authUser = async (req, res, next) => {
//     // Extract the token from headers
//     const { token } = req.headers;

//     // Check if the token is missing
//     if (!token) {
//         return res.status(403).json({ success: false, message: 'Not Authorized. Login Again' });
//     }

//     try {
//         // Verify the token using the secret key
//         const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

//         // Check if the decoded token contains a user ID
//         if (tokenDecode.id) {

//             // Attach user ID to the request body
//             req.body.userId = tokenDecode.id; 
            
//         } else {
//             return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
//         }

//         // Call the next function in the stack
//         next();
//     } catch (error) {
//         console.error('JWT Error:', error.message);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // Export the middleware
// export default authUser; 


