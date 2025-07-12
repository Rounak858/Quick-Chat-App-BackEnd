
const jwt = require('jsonwebtoken');

module.exports = (req,response,next) => {
    try{
        const token  = req.headers.authorization.split(' ')[1];
        const decodeToken = jwt.verify(token,process.env.SECRET_KEY); //{userId: user._id}
        req.userID = decodeToken.userID;
        next();
    } catch(error) {
        return response.send({
            messaege: error.message,
            success: false
        })
    }
};


// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(403).send({
//                 message: "Access denied. No token provided.",
//                 success: false,
//             });
//         }

//         const token = authHeader.split(" ")[1];
//         const decoded = jwt.verify(token, process.env.SECRET_KEY);
//         req.userID = decoded.userID;
//         next();
//     } catch (error) {
//         return res.status(403).send({
//             message: "Invalid or expired token",
//             success: false,
//         });
//     }
// };

