import Dept from '../model/department.js'
import Position from '../model/position.js'
import User from '../model/user.js'
import Batch from '../model/batch.model.js'
import College from '../model/college.model.js'
import Company from '../model/company.model.js'
import Interview from '../model/interview.model.js'
import Student from '../model/student.model.js'
import SIMapper from '../model/studentInterviewMapper.model.js'
import { genData } from '../generators/csv_gen.js'

export default class AdminController{
    // To retrive the department page
    getDepartment(req, res) {
        res.render('./admin/add_department', {
            title: "Add Department",
            menuPartial:"_admin_menu"
        })
    }
    // check for duplicate and add department
    async postDepartment(req, res) {
        try {
            const department = await Dept.findOne({ 'dept_name': req.body.depName })

            if (!department) {
                await Dept.create({
                    dept_name:req.body.depName,
                    contact_no:req.body.contact,
                    dept_status:req.body.status
                })
                return res.status(200).json({
                    success: true,
                    message:"Department added successfully"
                })
            } 
            return res.status(409).json({
                success: false,
                error: 'Duplicate entry detected.'
            })
        } catch (err) {
            console.log("Error while adding the department", err)
            res.status(500).json({error: "Internal server error."})
        }
    }
    // get position
    async getPosition(req, res) {
        try {
            const department = await Dept.find({})
            return res.render('./admin/add_position', {
                title: 'Add Position',
                menuPartial: '_admin_menu',
                department:department
            })
        } catch (err) {
            console.log("Error while adding the position", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/admin/employees'
            </script>`)
        }
    }
    // check for duplicate and add position 
    async postPosition(req, res) {
        try {
            const id = req.body.deptId
            const dept = await Dept.findOne({ _id: id })
            if (id.length < 24 || !dept) {
                return res.status(404).json({
                    error: "Invalid Department Name"
                })
            }
            const pos = await Position.findOne({ pos_name: req.body.posName, department:id })
            if (!pos) {
                const newPos = await Position.create({
                    pos_name: req.body.posName,
                    pos_status: req.body.status,
                    department:id
                })
                dept.positions.push(newPos)
                await dept.save()
                return res.status(200).json({
                    success: true,
                    message:"Position added successfully"
                })
            } else {
                return res.status(409).json({
                    success: false,
                    error: 'Duplicate entry detected.'
                })
            }
        } catch (err) {
            console.log("Error while adding the position", err)
            return res.status(500).json({error:"Internal server error."})
        }
    }
    // to dynamically check fetch the position against the departmment selected in add employee pages 
    async getPositions(req, res) {
        try {
            const id = req.query.departmentId
            const dept = await Dept.findById(id)
            if (dept) {
                const positions = await Position.find({ department: id })
                if (!positions || positions.length === 0) {
                    return res.status(404).json({error:"No positions available. Contact admin."})
                }
                return res.status(200).json(positions)
            } else {
                return res.status(400).json({ error:"No department found." })
            }
        } catch (err) {
            console.log("Error while getting the positions", err)
            return res.status(500).json({error:"Internal server error."})
        }
    }
    // to get add employee
    async getAddEmployee(req, res) {
        try {
            const department = await Dept.find()
            const position = await Position.find({ department: department[0]._id })
            return res.render('admin/add_employee', {
                title: 'Add employee',
                menuPartial: '_admin_menu',
                position: position,
                department: department
            })
        }catch (err) {
            console.log("Error while getting the add employee", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/admin/employees'
            </script>`)
        }
    }
    // get employee view in edit mode after check  the availability of at least one department and position
    async getEditEmployee(req, res) {
        try {
            const department = await Dept.find()
            const position = await Position.find({ department: department[0]._id })
            const {userid} = req.query
            const user = await User.findById(userid).select(`-password`)
            if (!user) {
                return res.status(401)
                .send(`<script>
                alert('Invalid employee id');
                    window.location.href = '/admin/employees';
                    </script>`)
            }
            return res.render('./admin/edit_employee', {
                title: "Edit Employee",
                menuPartial: "_admin_menu",
                department: department,
                position:position,
                user: user
            })
        }catch (err) {
            console.log("Error while getting edit employee", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/admin/employees'
            </script>`)
        }
    }
    // submit updated employee details
    async postEditEmployee(req, res) {
        try {
            const { id, fName, lName, contact, dob, gender, qualification } = req.body
            const user = User.findById(id)
            if (!user) {
                res.status(404).json({error:"Invalid user"})
            }
            await User.findByIdAndUpdate(id,
                {
                    first_name: fName,
                    last_name: lName,
                    contact_no: contact,
                    date_of_birth: dob,
                    gender: gender,
                    qualification:qualification
                })
            return res.status(200).json({
                success: true,
                message:"Employee updated successfully"
            })
        } catch (err) {
            console.log("Error while updating the user", err)
            return res.status(500).json({error:"Internal server error"})
        }
    }
    // get all employees
    async viewEmployees(req, res) {
        try {
            const user = await User.find({status:'active'}).select('-password')
            if (!user) {
                return res.status(401)
                .send(`<script>
                alert('No user found');
                    window.location.href = '/admin/timeline';
                    </script>`)
            }
            return res.render('./admin/view_employees', {
                title: "View Employee",
                menuPartial: "_admin_menu",
                user: user
            })
        }catch (err) {
            console.log("Error while getting employees", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/admin/home'
            </script>`)
        }
    }
    // delete employee
    async deleteEmployee(req, res) {
        try {
            const { userid } = req.query
            await User.findByIdAndUpdate(userid, {status:'inactive'})
            res.status(200).send(`<script>alert("User deleted successfully.")
            window.location.href = '/admin/employees'
            </script>`)
        } catch (err) {
            console.log("Error while deleting employee", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/admin/employees'
            </script>`)
        }
    }
    // get  batch
    async getBatch(req, res) {
        return res.render('./admin/add_batch', {
            title: "Add Batch",
            menuPartial: "_admin_menu",
        })
    }
    // add batch
    async postBatch(req, res) {
        const {batch_name, batch_no, status} = req.body
        try {
            const batch = await Batch.findOne({ 'batchName': batch_name })

            if (!batch) {
                await Batch.create({
                    batchName:batch_name,
                    batchNo:batch_no,
                    status: status,
                    posted_by:req.userID
                })
                return res.status(200).json({
                    success: true,
                    message:"Batch added successfully"
                })
            } 
            return res.status(409).json({
                success: false,
                error: 'Duplicate entry detected.'
            })
        } catch (err) {
            console.log("Error while adding the batch", err)
            res.status(500).json({error: "Internal server error."})
        }
    }
    // get  college
    async getCollege(req, res) {
        return res.render('./admin/add_college', {
            title: "Add College",
            menuPartial: "_admin_menu",
        })
    }
    // add college
    async postCollege(req, res) {
        const {college_name, address, contact, status} = req.body
        try {
            const college = await College.findOne({ 'name': college_name })

            if (!college) {
                await College.create({
                    name:college_name,
                    address: address,
                    contact:contact,
                    status: status,
                    posted_by:req.userID
                })
                return res.status(200).json({
                    success: true,
                    message:"College added successfully"
                })
            } 
            return res.status(409).json({
                success: false,
                error: 'Duplicate entry detected.'
            })
        } catch (err) {
            console.log("Error while adding the college", err)
            res.status(500).json({error: "Internal server error."})
        }
    }
    // get company
    async getCompany(req, res) {
        return res.render('./admin/add_company', {
            title: "Add Company",
            menuPartial: "_admin_menu",
        })
    }
    // add company
    async postCompany(req, res) {
        const {company_name, company_address, contact_person_name, contact, status} = req.body
        try {
            const company = await Company.findOne({ 'name': company_name })

            if (!company) {
                await Company.create({
                    name:company_name,
                    address: company_address,
                    contactPersonName: contact_person_name,
                    contactPersonMobile:contact,
                    status: status,
                    posted_by:req.userID
                })
                return res.status(200).json({
                    success: true,
                    message:"Company added successfully"
                })
            } 
            return res.status(409).json({
                success: false,
                error: 'Duplicate entry detected.'
            })
        } catch (err) {
            console.log("Error while adding the Company", err)
            res.status(500).json({error: "Internal server error."})
        }
    }
    // get all the companies
    async getCompanies(req, res) {
        try {
            const companies = await Company.find().populate('posted_by', 'first_name last_name -_id')
            if (companies.length !== 0) {
                return res.render('./admin/view_companies', {
                    title: "View Companies",
                    menuPartial: "_admin_menu",
                    companies:companies
                })
            }else {
                return res.status(404).send(`<script>
                alert("No company data found")
                </script>`)
            }
        } catch (err) {
            console.log("Error while getting the companies", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/admin/employees'
            </script>`)
        }
    }
    // get company specific interview
    async getInterview(req, res) {
        const {comp_id} = req.query
        return res.render('./admin/add_interview', {
            title: "Add Interview",
            menuPartial: "_admin_menu",
            comp_id:comp_id
        })
    }
    // add company specific interview
    async postInterview(req, res) {
        const { company, profile_name, profile_desc, interview_date, status } = req.body
        
        try {
            const comp = await Company.findById(company)
            if (!comp) {
                return res.status(404).json({error:"Invalid company id."})
            }
            const interviewExist = await Interview.findOne({ profileName: profile_name })
            if (!interviewExist) {
                const interview = await Interview.create({
                    profileName:profile_name,
                    profileDescription: profile_desc,
                    date: interview_date,
                    company:company,
                    status: status,
                    posted_by:req.userID
                })
                comp.interviews.push(interview)
                await comp.save()
                return res.status(200).json({
                    success: true,
                    message:"Interview added successfully"
                })
            } 
            return res.status(409).json({
                success: false,
                error: 'Duplicate entry detected.'
            })
        } catch (err) {
            console.log("Error while adding the Company", err)
            res.status(500).json({error: "Internal server error."})
        }
    }
    // get all the interviews of a specific company
    async getCompanyInterviews(req, res) {
        const comp_id = req.query.comp_id;

        try {
            const company = await Company.findById(comp_id)
                .populate({
                    path: 'interviews'
                })
            if (!company) {
                return res.status(404).send(`<script>
                    alert("Invalid company.");
                    window.location.href = '/admin/companies';
                </script>`);
            }
            const interviews = company.interviews
            return res.render('./admin/view_interviews', {
                title: "View Interviews",
                menuPartial: "_admin_menu",
                company:company.name,
                interviews: interviews
            });
        } catch (err) {
            console.log("Error while getting the Interviews", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/admin/companies'
            </script>`)
        }
    }
    // get all the student specific interviews
    async getStudentInterviews(req, res) {
        try {
            let stud_id = req.query.stud_id
            stud_id = stud_id.trim()
            if (stud_id.length < 24) {
                return res.status(404).send(`<script>
                alert("Invalid Student")
                window.location.href = '/admin/companies'
                </script>`)
            }
            const entryExist = await SIMapper.findOne({ student: stud_id })
            if (!entryExist) {
                return res.status(404).send(`<script>
                alert("No Interview available")
                window.history.back()
                </script>`)
            }
            const interviewsList = await SIMapper.find({ student: stud_id }).
                populate({ path: 'interview', select: 'profileName profileDescription date -_id', populate: { path: 'company', select: 'name -_id' } }).populate({path:'student', select:'name -_id'});
            return res.render('./admin/view_student_interviews', {
                menuPartial: '_admin_menu',
                title: 'View Student Interviews',
                interviews:interviewsList
            })
        } catch (err) {
            console.log("Error while getting the Student interviews", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/admin/companies'
            </script>`)
        }
    }
    // get student
    async getStudent(req, res) {
        try {
            const batch = await Batch.find()
            const college = await College.find()
            return res.render('./admin/add_student', {
                title: 'Add Student',
                menuPartial: '_admin_menu',
                batch: batch,
                college:college
            })
        } catch (err) {
            console.error("Error occured in getStudent", err)
            return res.status(500).send(`<script>
            alert("Internal server error")
            window.location.href = '/admin/companies'
            </script>`)
        }
    }
    // add student
    async postStudent(req, res) {
        try {
            const { batch, college, name, contact, placement_status, status, dsa, webD, react } = req.body
            const subjectsMarks = [{name:'dsa', scores:dsa}, {name:'webD',scores:webD}, {name:'react',scores:react}]
            const studentExist = await Student.findOne({contact:contact})
            if (!studentExist) {
                const student = await Student.create({
                    batch: batch,
                    name: name,
                    college: college,
                    contact: contact,
                    placement_status: placement_status,
                    status: status,
                    added_by: req.userID
                })
                student.subjects.push(subjectsMarks[0])
                student.subjects.push(subjectsMarks[1])
                student.subjects.push(subjectsMarks[2])
                await student.save()
                console.log(student)
                return res.status(200).json({success:true, message:"Student created successfully."})
            }
            return res.status(400).json({error:"Duplicate entry detected."})
        } catch (err) {
            console.log("Error while adding the Student", err)
            res.status(500).json({error: "Internal server error."})
        }
    }
    // get all the students
    async getStudents(req, res) {
        try {
            let interview_id = req.query.inter_id
            interview_id = interview_id.trim()
            if (interview_id.length < 24) {
                return res.status(404).send(`<script>
                alert("Invalid Interview")
                window.location.href = '/admin/companies'
                </script>`)
            }
            const interviewExist = await Interview.findById(interview_id)
            if (!interviewExist) {
                return res.status(404).send(`<script>
                alert("Invalid Interview")
                window.location.href = '/admin/companies'
                </script>`)
            }
            if (interviewExist.date < new Date()) {
                return res.status(400).send(`<script>
                alert("Can't register for past date Interviews."); 
                window.history.back()
                </script>`)
            }
            const students = await Student.find().populate('college', 'name -_id').populate('batch', 'batchName -_id').populate('subjects')
            let studentCollection = students
            studentCollection.forEach(student => {
                const result = student.interviews.includes(interview_id)
                student.registered = result
            })
            return res.render('./admin/view_students', {
                menuPartial: '_admin_menu',
                students: students,
                title: 'View Students',
                interview_id:interview_id
            })
        } catch (err) {
            console.error("Error occured in getStudents", err)
            return res.status(500).send(`<script>
            alert("Internal server error")
            window.location.href = '/admin/companies'
            </script>`)
        }
    }
    // register student in an interview using ajax
    async registerStudent(req, res) {
        try {
            // console.log(req.query)
            let student = req.query.stud_id
            let interv_id = req.query.interv_id
            if (!interv_id || !student) {
                return res.status(404).json({success:false, message:"Student ID/ Interview ID is mendatory."})
            }
            student = student.trim()
            interv_id = interv_id.trim()
            if (student.length < 24 || interv_id.length < 24) {
                return res.status(404).json({success:false, message:"Invalid student/ interview ID."})
            }
            const studentExist = await Student.findById(student)
            const interviewExist = await Interview.findById(interv_id)
            if (interviewExist.date < new Date()) {
                return res.status(400).json({success:false, message:"Entries for this interview are closed now."})
            }
            if (!studentExist || !interviewExist) {
                return res.status(400).json({success:false, message:"Invalid student/ interview."})
            }
            const mapperExist = await SIMapper.findOne({
                interview: interv_id,
                student:student
            })
            if (mapperExist) {
                return res.status(400).json({success:false, message:"Duplicate entry are not allowed"})
            }
            studentExist.interviews.push(interv_id)
            await studentExist.save()
            interviewExist.students.push(student)
            await interviewExist.save()
            const mapperResult = await SIMapper.create({
                interview: interv_id,
                student:student
            })
            return res.status(200).json({success:true, message:"Registered successfully"})
        } catch (err) {
            console.error("Error occured in registerStudent", err)
            return res.status(500).json({success:false, message:"Internal Server error"})
        }
    }
    // deregister student from the interview using ajax
    async deRegStudent(req, res) {
        try {
            let student = req.query.stud_id
            let interv_id = req.query.interv_id
            if (!interv_id || !student) {
                return res.status(404).json({success:false, message:"Student ID/ Interview ID is mendatory."})
            }
            student = student.trim()
            interv_id = interv_id.trim()
            if (student.length < 24 || interv_id.length < 24) {
                return res.status(404).json({success:false, message:"Invalid student/ interview ID."})
            }
            const mapperExist = await SIMapper.findOne({
                interview: interv_id,
                student:student
            })
            if (!mapperExist) {
                return res.status(400).json({success:false, message:"No entry found"})
            }
            const studentExist = await Student.findById(student)
            const interviewExist = await Interview.findById(interv_id)
            if (!studentExist || !interviewExist) {
                return res.status(400).json({success:false, message:"Invalid student/ interview."})
            }
            studentExist.interviews.pull(interv_id)
            await studentExist.save()
            interviewExist.students.pull(student)
            await interviewExist.save()
            const mapperResult = await SIMapper.findOneAndDelete({
                interview: interv_id,
                student: student
            })
            if (mapperResult) {
                return res.status(200).json({ success: true, message: "De-registered successfully" })
            }
        } catch (err) {
            console.error("Error occured in deregisterStudent", err)
            return res.status(500).json({success:false, message:"Internal Server error"})
        }
    }
    async getResInterviews(req, res) {
        try {
            const currentDate = new Date();
            const interviews = await Interview.find({ date: { $lt: currentDate } }).populate('company')
            return res.render('./admin/view_all_interviews', {
                title: 'View all interviews',
                menuPartial: '_admin_menu',
                interviews:interviews
            })
        } catch (err) {
            console.error("Error occured in getStudents", err)
            return res.status(500).send(`<script>
            alert("Internal server error")
            window.location.href = '/admin/companies'
            </script>`)
        }
    }
    async getStudentInterviewResults(req, res) {
        try {
            let interv_id = req.query.interv_id
            interv_id = interv_id.trim()
            if (interv_id.length < 24) {
                return res.status(404).send(`<script>
                alert("Invalid Interview")
                window.history.back()
                </script>`)
            }
            const interviewExist = await Interview.findById(interv_id)
            if (!interviewExist) {
                return res.status(404).send(`<script>
                alert("No Interview found with this ID")
                window.history.back()
                </script>`)
            }
            if (interviewExist.students.length < 1) {
                return res.status(400).send(`<script>
                alert("No student is registered."); 
                window.history.back()
                </script>`)
            }
            if (interviewExist.date > new Date()) {
                return res.status(400).send(`<script>
                alert("Invalid Interview Date."); 
                window.history.back()
                </script>`)
            }
            const students = await SIMapper.find({interview:interv_id}).populate({path:'student', populate:[{path:'batch'}, {path:'college'}]})
            return res.render('./admin/add_student_interview_status', {
                title: 'Update Interview Status',
                menuPartial: '_admin_menu',
                students:students
            })
        } catch (err) {
            console.error("Error occured in getStudentInterviewResults", err)
            return res.status(500).send(`<script>
            alert("Internal server error")
            window.history.back()
            </script>`)
        }
    }
    async postStudentInterviewResults(req, res) {
        try {
            let { stud_id, interv_id, status } = req.query
            if (!stud_id || !interv_id || !status) {
                return res.status(404).json({success:false, message:"Invalid student/ interview Id/ Status"})
            }
            stud_id = stud_id.trim()
            interv_id = interv_id.trim()
            if (stud_id.length < 24 || interv_id.length < 24) {
                return res.status(404).json({success:false, message:"Invalid student/ interview Id"})
            }
            const relationExist = await SIMapper.findOne({ interview: interv_id, student: stud_id })
            if (!relationExist) {
                return res.status(404).json({success:false, message:"Invalid entry attempt"})
            }
            relationExist.status = status
            await relationExist.save()
            return res.status(200).json({success:true, message:"Updated ssuccessfully"})
        } catch (err) {
            console.log("Error occured while updating interview status", err)
            return res.status(500).json({success:false, message:"Server error"})
        }
    }
    async generateDataFile(req, res) {
        try {
            await genData()   
            return res.download('./csv/studentsResults.csv', (err) => {
                if (err) {
                    return res.send(`<script>
                    alert('Error occured while downloading the file'); 
                    window.location.href = '/'
                    </script>`)
                }
            })
        } catch (err) {
            console.error("Error occured in generateDataFile", err)
            return res.status(500).send(`<script>
            alert("Internal server error")
            window.location.href = '/admin/companies'
            </script>`)
        }
    }
}