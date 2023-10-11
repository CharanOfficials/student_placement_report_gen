// validate reset password data
import { body, validationResult } from 'express-validator'
export const resetValidateRequest = async (req, res, next) => {
    const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    const rules = [
    body('email')
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email address."),
    body('newPassword')
        .notEmpty()
        .withMessage('Password is required.')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.')
        .custom((value) => {
            return specialCharacterRegex.test(value);
        })
        .withMessage('Password must contain at least one special character.')
    ];
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