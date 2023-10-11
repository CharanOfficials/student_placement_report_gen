import Dept from '../model/department.js'
import Position from '../model/position.js'
import User from '../model/user.js'
import Performance from '../model/performance.js'
import Participation from '../model/participations.js'
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
    // make adminn to employee and vice versa
    async toggleRights(req, res) {
        try {
            const { status, userid } = req.query
            let updateStatus = "employee"
            if (status === "admin") {
                updateStatus = "employee"
            } else if (status === "employee") {
                updateStatus = "admin"
            }
            await User.findByIdAndUpdate(userid, { account_type: updateStatus })
            return res.status(200).send(`<script>alert("Rights updated successfully."); 
            window.location.href = '/admin/employees'
            </script>`)
        }catch (err) {
            console.log("Error while toggling the rights", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/admin/employees'
            </script>`)
        }
    }
    // get add performance page against an employee
    async getPerformance(req, res) {
        try {
            const {userid} = req.query
            const user = await User.findById(userid)
                .populate({ path: 'department', select: 'dept_name' })
                .populate({ path: 'position', select: 'pos_name' });
            res.render('./admin/add_performance', {
                title: "Add Performance",
                menuPartial: "_admin_menu",
                user:user
            })
        } catch (err) {
            console.log("Error while toggling the rights", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/admin/employees'
            </script>`)
        }
    }
    // add a new performance against an employee
    async postPerformance(req, res) {
        try {
            const posted_by_user = req.userID
            const p_review = req.body.p_review.trim()
            const userid = req.body.userid
            const status = "active"
            if (p_review.length === 0) {
                return res.status(400).json({error:"Invalid data."})
            }
            const user = await User.findById(userid)
            const perf = await Performance.create({
                content: p_review,
                status: status,
                posted_by_user: posted_by_user,
                posted_for_user: userid
            })
            user.performances.push(perf)
            await user.save()
            if (perf) {
                return res.status(200).json({success:true, message:"Performance added successfully."})
            }
        }catch (err) {
            console.log("Error while submitting the performance review", err)
            return res.status(500).json({error:"Internal server error"})
        }
    }
    // get all the performances available against an employee
    async viewPerformances(req, res) {
        try {
            const empId = req.query.userid

            const performances = await Performance.find({ posted_for_user: empId })
            .populate('posted_by_user', 'first_name last_name')
            .populate('posted_for_user', 'first_name last_name')
                .exec();
            return res.render('./admin/view_performances', {
                title: "View Performances",
                menuPartial: "_admin_menu",
                user: empId,
                performances: performances
            })
        }catch (err) {
            console.log("Error while getting performances.", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/admin/employees'
            </script>`)
        }
    }
    // get edit performance
    async getEditPerformance(req, res) {
        try {
            const { perf_id } = req.query
            const perf = await Performance.findById(perf_id)
            const user = await User.findById(req.userID)
            if (!perf) {
                return res.status(404).send(`<script>
                alert("Invalid performance request.")
                window.location.href='/admin/employees'
                </script>`)
            }
            return res.render(
                './admin/edit_performance',
                {
                    title: "Edit/ View Performance",
                    menuPartial:"_admin_menu",
                    performance: perf,
                    user:user
                }
            )
        }catch (err) {
            console.log("Error while getting edit performance.", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/admin/employees'
            </script>`)
        }
    }
    // save edited performance
    async postEditPerformance(req, res) {
        try {
            const p_review = req.body.p_review.trim()
            const { perf_id } = req.body
            const userid = req.userID
            if (p_review.length === 0) {
                return res.status(400).json({error:"Invalid data."})
            }
            const perf = await Performance.findById(perf_id)
            if (!perf || perf.feedback) {
                return res.status(404).json({error:"Invalid request"})
            }
            const performances = await Performance.findByIdAndUpdate(perf_id, { content: p_review, posted_by_user: userid })
            return res.status(200).json({success:true, message:"Review updated successfully"})
        }catch (err) {
            console.log("Error while posting edit performance.", err)
            return res.status(500).json({error:"Internal server error."})
        }
    }
    // delete performance
    async deletePerformance(req, res){
        try {
            const { perf_id } = req.query
            const delPerf = await Performance.findByIdAndDelete(perf_id)
            const user = await User.findById(delPerf.posted_for_user)
            user.performances.pull(perf_id)
            await user.save()
            if (delPerf) {
                return res.status(200).send(`<script>alert("Performance deleted successfullt.")
                window.location.href = '/admin/employees'
                </script>`)
            }
        }catch (err) {
            console.log("Error while deleting the performance.", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/admin/employees'
            </script>`)
        }
    }
    // get feedback
    async getFeedback(req, res) {
        try {
            const user = req.userID
            const { perf_id } = req.query
            const performance = await Performance.findById(perf_id).populate('feedback', 'content')
            // if (performance.feedback) {
            //     return res.status(200).send(`<script>alert("Feedback already submitted")
            //     window.location.href = "/employee/pendingfeedbacks"
            //     </script>`)
            // }
            const userD = await User.findById(user).select('-password')
                .populate({ path: 'department', select: 'dept_name' })
                .populate({ path: 'position', select: 'pos_name' });
            return res.render('./admin/view_feedback', {
                title: "Add Feedback",
                menuPartial: "_admin_menu",
                user: userD,
                performance:performance
            })
        } catch (err) {
            console.log("Error while getting the employee feedback.", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/employee/viewemployees'
            </script>`)
        }
    }
    // get page to allocate performances
    async getAllocParticipation(req, res) {
        try {
            const alloc_by = await User.findById(req.userID)
                .populate('first_name last_name')
                .populate('department', 'dept_name')
            const user = await User.find().select('-password').populate('department','dept_name')
            return res.render('./admin/review_participation', {
                title:'Review Participation',
                menuPartial: '_admin_menu',
                users: user,
                allocate_by:alloc_by
            })
        }catch (err) {
            console.log("Error while getting the Review Participation.", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/admin/employees'
            </script>`)
        }
    }
    //  allocate performances
    async postAllocParticipation(req, res) {
        try {
            const fromUser = req.userID;
            const { dropdown, multiselect } = req.body;
            const alloc = multiselect
                .filter(alloc => alloc.alloc && alloc.alloc.length === 24)
                .map(alloc => alloc.alloc)
            if (alloc.length === 0) {
                return res.status(404).json({error:"Empty allocations are not allowed."})
            }
            const partResult = await Participation.findOne({ allocatee: dropdown }).
                populate('allocatee', 'first_name last_name')
            if (!partResult && alloc.length > 0) {
                const participated = await Participation.create({
                    allocatee: dropdown,
                    allocater: fromUser,
                    allocated: alloc
                });

                return res.status(200).json({ success: true, message: "Allocations done successfully" })
            } else if(partResult) {
                return res.status(409).json({ error: `Ask ${partResult.allocatee.first_name} ${partResult.allocatee.last_name} to clear previous pending performances first.` })
            }
        }catch (err) {
            console.log("Error while adding the department", err)
            res.status(500).json({ error: "Internal server error." })
        }
    }
}