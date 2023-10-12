import jwt from "jsonwebtoken"

const loginExists = (req, res, next) => {
    // 1. Read token
    const token = req.cookies.jwt;
    // If no token, continue with the request
    if (!token) {
        return next();
    }

    // If token exists, check its validity
    try {
        const payloadjwt = jwt.verify(token, process.env.JWT_SECRET);
        if (payloadjwt.userType === "admin") {
            return res.send("<script>window.location.href = '/admin/companies'</script>");
        } else {
            return res.send("<script>window.location.href = '/'</script>");
        }
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            // Handle token expiration error
            next()
            return
        } else {
            // Handle other errors
            console.log('JWT middleware error while checking the existing login:', err);
            return res.status(401).send(`<script>
                alert('Issue occurred while checking the authorization.');
            </script>`);
        }
    }
};

export default loginExists;
