import express from 'express'
import UserController from '../controller/user.controller.js'
import adminRouter from './admin.router.js'
import employeeRouter from './employee.router.js'
import {loginValidateRequest} from '../middleware/vSignIn.middleware.js'
import { signUpValidateRequest } from '../middleware/vSignUp.middleware.js'
import { checkData } from '../middleware/vGetSignUp.middleware.js'
import { resetValidateRequest } from '../middleware/vResetPass.middleware.js'
import loginExists from '../middleware/vLoginExist.middleware.js'
const router = express.Router()
const userController = new UserController()

router.get('/signIn', loginExists, (req, res) =>{
    userController.getSignIn(req, res)
})
router.post('/signIn', loginValidateRequest, (req, res) =>{
    userController.postSignIn(req, res)
})
router.get('/signUp',checkData, (req, res) =>{
    userController.getSignUp(req, res)
})
router.post('/signUp', signUpValidateRequest, (req, res) =>{
    userController.postSignUp(req, res)
})
router.get('/forgotPassword', loginExists, (req, res) =>{
    userController.getResetPassword(req, res)
})
router.post('/forgotPassword', resetValidateRequest, (req, res) =>{
    userController.postResetPassword(req, res)
})
router.get('/logout', (req, res) =>{
    userController.postLogout(req, res)
})
router.use('/admin', adminRouter)
router.use('/employee', employeeRouter)
// home page
router.get('/', (req, res) => {
    res.render('home')
})
// invalid page redirects
router.use('/', (req, res) => {
    res.status(404);
    res.send(`
        <script>
            alert("This page doesn't exist");
            window.history.back();
        </script>
    `);
})
export default router