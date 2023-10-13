// validate signUp
import { body, validationResult } from 'express-validator'
export const validateStudent = async (req, res, next) => {
    const rules = [
    body('batch')
        .isLength({ min: 24, max: 24 })
        .withMessage("Invalid batch"),
    body('college')
        .isLength({ min: 24, max: 24 })
        .withMessage("Invalid college"),
    body('name')
        .isLength({ min: 10, max: 40 })
        .withMessage("Name should be between 10 and 40 characters."),
    body('contact')
        .isLength({ min: 10, max: 12 })
        .withMessage("Contact number should be between 10 and 12 characters."),
    body('placement_status', "Invalid placement status type.").custom((value) => {
            if (value === "placed" || value === 'not_placed') {
                return true
            }
    }),
    body('status', "Invalid status type.").custom((value) => {
            if (value === "active" || value === 'inactive') {
                return true
            }
    }),
    body('dsa')
        .isInt({ min: 70, max: 100 })
        .withMessage("DSA marks should be between 70 - 100 to qualify."),
    body('webD')
        .isInt({ min: 70, max: 100 })
        .withMessage("Web Development marks should be between 70 - 100 to qualify."),
    body('react')
        .isInt({ min: 70, max: 100 })
        .withMessage("React marks should be between 70 - 100 to qualify.")
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