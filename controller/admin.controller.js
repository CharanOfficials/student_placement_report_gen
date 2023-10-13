import Dept from '../model/department.js'
import Position from '../model/position.js'
import User from '../model/user.js'
import Batch from '../model/batch.model.js'
import College from '../model/college.model.js'
import Company from '../model/company.model.js'
import Interview from '../model/interview.model.js'

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
    // get  batch
    async getCollege(req, res) {
        return res.render('./admin/add_college', {
            title: "Add College",
            menuPartial: "_admin_menu",
        })
    }
    // add batch
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
    // get  batch
    async getCompany(req, res) {
        return res.render('./admin/add_company', {
            title: "Add Company",
            menuPartial: "_admin_menu",
        })
    }
    // add batch
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
    async getInterview(req, res) {
        const {comp_id} = req.query
        return res.render('./admin/add_interview', {
            title: "Add Interview",
            menuPartial: "_admin_menu",
            comp_id:comp_id
        })
    }
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
    async getInterviews(req, res) {
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
}