// validate signUp
import { body, validationResult } from 'express-validator'
import User from '../model/user.js'
export const signUpValidateRequest = async (req, res, next) => {
    console.log(req.body)
    const rules = [
    body('fName')
        .isLength({ min: 2, max: 20 })
        .withMessage("First name should be between 2 and 20 characters."),
    body('lName')
        .isLength({ min: 2, max: 20 })
        .withMessage("Last name should be between 2 and 20 characters."),
    body('email')
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email address."),
    body('contact')
        .isLength({ min: 10, max: 15 })
        .withMessage("Contact number should be between 10 and 15 characters."),
    body('empid')
        .isLength({ min: 12, max: 18 })
        .withMessage("Employee ID should be between 12 and 18 characters."),
    body('dob')
        .isDate()
        .withMessage("Invalid date of birth. It should be <= 2000-01-01")
        .custom((value) => {
        if (new Date(value) >= new Date('2000-01-01')) {
            throw new Error("Date of birth should be less than 2000-01-01.");
        }
        return true;
        }),
    body('dept')
        .exists()
        .withMessage("Dept name can't be empty.")
        .isLength({ min:24, max:24 })
            .withMessage("Invalid department name"),
    body('position')
    .exists()
    .withMessage("Position name can't be empty.")
    .isLength({ min: 24, max:24 })
    .withMessage("Invalid position name"),
    body('qualification')
        .notEmpty()
        .withMessage("Invalid highest qualification.")
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

    const validate2 = await User.findOne({ $or: [{ email: req.body.email }, { contact_no: req.body.contact }, { employee_id: req.body.empid }] });

    if (validate2) {
        return res.status(409).json({
            success: false,
            error: 'Duplicate email/ employee id/ contact detected.'
        })
    }
    next()
}