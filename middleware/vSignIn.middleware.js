// validate sign In
import { body, validationResult } from 'express-validator'
export const loginValidateRequest = async (req, res, next) => {
    const rules = [
        body('account_type', "Invalid user type.").custom((value) => {
            if (value === "employee" || value === 'admin') {
                return true
            }
        }),
        body('email').notEmpty().withMessage("Email is required."),
        body('password').notEmpty().withMessage("Password is required.")
    ]
    //  2. Run these rules
    await Promise.all(rules.map(rule => rule.run(req)))
    
    //  3. check if there are any errors after running the rules
    var validationErrors = validationResult(req)
    // 4. If error then return the error messages
    if (!validationErrors.isEmpty()) {
        // To render the error on login page
        return res.status(400).json({
            error: validationErrors.array()[0].msg
        })
    }
    next()
}