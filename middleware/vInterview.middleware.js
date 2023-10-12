// to validate dept data
import { body, validationResult } from 'express-validator'
export const validateInterview = async (req, res, next) => {
    const rules = [
        body('company').isLength({ min: 24, max: 24 }).withMessage("Invalid company id."),
        body('profile_name').isLength({ min: 10, max: 25 }).withMessage("Invalid profile name. Allowed length 10 - 25."),,
        body('profile_desc').isLength({ min: 10, max: 200 }).withMessage("Invalid profile description. Allowed length 10 - 200."),
        body('interview_date')
            .isDate()
            .withMessage("Interview should be scheduled at least 2 days in advance.")
            .custom((value) => {
            const currentDate = new Date();
            const minimumDate = new Date();
            minimumDate.setDate(currentDate.getDate() + 2);
            if (new Date(value) <= minimumDate) {
                throw new Error("Interview should be scheduled at least 2 days in advance.");
            }
            return true;
        }),

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