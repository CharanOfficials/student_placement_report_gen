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
// validate batch data
import { validateBatch } from '../middleware/vBatch.middleware.js'
// validate college data
import {validateCollege} from '../middleware/vCollege.middleware.js'
// validate company data
import { validateCompany } from '../middleware/vCompany.middleware.js'
// validate company id
import {validateCompId} from '../middleware/vCompId.middleware.js'
// validate interview data
import {validateInterview} from '../middleware/vInterview.middleware.js'
// validate student data
import {validateStudent} from '../middleware/vStudent.middleware.js'

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
router.get('/batch', validateAdmin, (req, res) => {
    adminController.getBatch(req,res)
})
router.post('/batch', validateAdmin, validateBatch, (req, res) => {
    adminController.postBatch(req,res)
})
router.get('/college', validateAdmin, (req, res) => {
    adminController.getCollege(req,res)
})
router.post('/college', validateAdmin, validateCollege, (req, res) => {
    adminController.postCollege(req,res)
})
router.get('/company', validateAdmin, (req, res) => {
    adminController.getCompany(req,res)
})
router.post('/company', validateAdmin, validateCompany, (req, res) => {
    adminController.postCompany(req,res)
})
router.get('/companies', validateAdmin, (req, res) => {
    adminController.getCompanies(req,res)
})
router.get('/interview', validateAdmin, validateCompId,(req, res) => {
    adminController.getInterview(req,res)
})
router.post('/interview', validateAdmin, validateInterview,(req, res) => {
    adminController.postInterview(req,res)
})
router.get('/interviews', validateAdmin, validateCompId,(req, res) => {
    adminController.getInterviews(req,res)
})
router.get('/student', validateAdmin, (req, res) => {
    adminController.getStudent(req,res)
})
router.post('/student', validateAdmin, validateStudent, (req, res) => {
    adminController.postStudent(req,res)
})
router.get('/students', validateAdmin, (req, res) => {
    adminController.getStudents(req,res)
})
router.get('/regStudent', validateAdmin, (req, res) => {
    adminController.registerStudent(req,res)
})
router.get('/deRegStudent', validateAdmin, (req, res) => {
    adminController.deRegStudent(req,res)
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