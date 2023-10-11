import express from 'express'
import AdminController from '../controller/admin.controller.js'
import { deptValidateRequest } from '../middleware/vDept.middleware.js'
import { posValidateRequest } from '../middleware/vPos.middleware.js'
// to disallow cross user type request
import validateAdmin from '../middleware/vAdmin.middleware.js'
import { empEditValidateRequest } from '../middleware/vEmpEdit.middleware.js' 
// check department and position availability
import { checkData } from '../middleware/vGetSignUp.middleware.js'
// validate user id if sent in query params to avoid db id length errors
import { validateEmp } from '../middleware/vUserId.middleware.js'
// validate performance id
import { validatePerfId } from '../middleware/vPerfId.middleware.js'

const router = express.Router()
const adminController = new AdminController()
router.get('/department', validateAdmin, (req, res) => {
    adminController.getDepartment(req,res)
})
router.post('/department', validateAdmin, deptValidateRequest, (req, res) => {
    adminController.postDepartment(req,res)
})
router.get('/position', validateAdmin, (req, res) => {
    adminController.getPosition(req,res)
})
router.post('/position', validateAdmin, posValidateRequest, (req, res) => {
    adminController.postPosition(req,res)
})
// get positions in signup page. A json request
router.get('/getPositions', (req, res) => {
    adminController.getPositions(req,res)
})
router.get('/employee', validateAdmin, (req, res) => {
    adminController.getAddEmployee(req,res)
})
// get all employees
router.get('/employees', validateAdmin, (req, res) => {
    adminController.viewEmployees(req,res)
})
router.get('/editemployee', validateAdmin, validateEmp, checkData, (req, res) => {
    adminController.getEditEmployee(req,res)
})
router.post('/editemployee', validateAdmin, empEditValidateRequest, (req, res) => {
    adminController.postEditEmployee(req,res)
})
router.get('/deleteemployee', validateAdmin, validateEmp, (req, res) => {
    adminController.deleteEmployee(req,res)
})
router.get('/toggleRights', validateAdmin, validateEmp, (req, res) => {
    adminController.toggleRights(req,res)
})
router.get('/performance', validateAdmin, validateEmp, (req, res) => {
    adminController.getPerformance(req,res)
})
router.post('/performance',validateAdmin, (req, res) => {
    adminController.postPerformance(req,res)
})
router.get('/performances',validateAdmin, validateEmp, (req, res) => {
    adminController.viewPerformances(req,res)
})
router.get('/editperformance',validateAdmin, validatePerfId, (req, res) => {
    adminController.getEditPerformance(req,res)
})
router.post('/editperformance',validateAdmin, validatePerfId,(req, res) => {
    adminController.postEditPerformance(req,res)
})
router.get('/delperformance', validateAdmin, validatePerfId, (req, res) => {
    adminController.deletePerformance(req, res)
})
router.get('/feedback', validateAdmin, (req, res) => {
    adminController.getFeedback(req,res)
})
router.get('/allocparticipation', validateAdmin, (req, res) => {
    adminController.getAllocParticipation(req, res)
})
router.post('/allocparticipation', validateAdmin, (req, res)=>{
    adminController.postAllocParticipation(req, res)
})
// invalid page route for /admin
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