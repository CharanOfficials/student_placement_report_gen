import express from 'express'
import EmployeeController from '../controller/employee.controller.js'
import validateEmployee from '../middleware/vEmployee.middleware.js'

const router = express.Router()
const employeeController = new EmployeeController()

router.get('/pendingfeedbacks', validateEmployee, (req, res) => {
    employeeController.pendingFeedbacks(req, res)
})
router.get('/feedback', validateEmployee, (req, res) => {
    employeeController.getFeedback(req,res)
})
router.post('/feedback', validateEmployee, (req, res) => {
    employeeController.postFeedback(req,res)
})
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