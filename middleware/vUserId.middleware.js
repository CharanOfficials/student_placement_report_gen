// validate user id when user id received in query params
import User from '../model/user.js'
export const validateEmp = async (req, res, next) => {
    const {userid} = req.query
    if (userid.length !== 24) {
        return res.status(404).send(`<script>
            alert("Invalid User")
            window.location.href = '/admin/employees'
        </script>`)
    }
    const validate = await User.findById(userid);

    if (!validate) {
        return res.status(404).send(`<script>
            alert("Invalid User")
            window.location.href = '/admin/employees'
        </script>`)
    }
    next()
}