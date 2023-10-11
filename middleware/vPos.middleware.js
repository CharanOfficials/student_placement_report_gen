//  validate podition data
import { body, validationResult } from 'express-validator'

export const posValidateRequest = async (req, res, next) => {
    const rules = [
        body('posName').notEmpty().withMessage("Invalid position name."),
        body('deptId').exists().withMessage("Dept name can't be empty.").isLength({ min:24, max:24 }).withMessage("Invalid department name"),
        body('status', "Invalid status type.").custom((value) => {
            if (value === "active" || value === 'inactive') {
                return true
            }
        })
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