// To implement user authentication

import jwt from "jsonwebtoken"
const jwtauth = (req, res, next) => {
    // 1. Read token
    const token = req.cookies.jwt
    // If no token then send invalid token
    if (!token) {
        return res.status(401)
            .send(`<script>
                alert('Unauthorized request are not allowed');
                    window.location.href = '/signIn';
                    </script>`)
    }
    // If token then check validity
    try {
        const payloadjwt = jwt.verify(token, process.env.JWT_SECRET)
        req.userID = payloadjwt.userId // To extract the ID in cart controller
        req.type = payloadjwt.userType
        req.email = payloadjwt.userEmail
    } catch (err) {
        // else return error
        if (err.name === 'TokenExpiredError') {
            // Handle token expiration error
            return res.status(401).send(`<script>
                alert('Token has expired. Please sign in again.');
                window.location.href = '/signIn';
                </script>`);
        }
        return res.status(401)
                .send(`<script>
                alert('Unauthorized request are not allowed');
                    window.location.href = '/signIn';
                    </script>`)
    }
    // If valid call next
    next()
}

export default jwtauth