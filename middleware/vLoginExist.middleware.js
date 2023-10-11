// if login already exist the redirect to home on the basis of accout type

import jwt from "jsonwebtoken"
const loginExists = (req, res, next) => {
    // 1. Read token
    const token = req.cookies.jwt
    // If no token then send invalid token
    if (!token) {
        next()
        return
    }
    // If token then check validity
    try {
        const payloadjwt = jwt.verify(token, process.env.JWT_SECRET)
        if (payloadjwt.userType === "admin") {
            return res.send(`<script>window.location.href = '/admin/employees'</script>`)
        } else if (payloadjwt.userType === "employee") {
            return res.send(`<script>window.location.href = '/employee/pendingfeedbacks'</script>`)
        }
    } catch (err) {
        // else return error
        console.log('JWT middleware error while check the existing login:',err)
        return res.status(401)
                .send(`<script>
                alert('Unauthorized request are not allowed')
                    
                    </script>`)
    }
}

export default loginExists