// to validate dept data
import { body, validationResult } from 'express-validator'
export const validateBatch = async (req, res, next) => {
    const rules = [
        body('batch_name').notEmpty().withMessage("Invalid batch name."),
        body('batch_no').isLength({ min: 5, max: 12 }).withMessage("Invalid batch no. Allowed length 5 - 12."),
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