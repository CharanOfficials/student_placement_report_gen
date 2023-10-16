import Pos from '../model/position.js'
import Dept from '../model/department.js'
import passGen from '../generators/password_gen.js'
import User from '../model/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import getJobData from '../generators/jobs.js'
// import jwt from 'jsonwebtoken'
export default class UserController{
    // get sign in
    getSignIn(req, res) {
        res.render('sign_in', {
            title:'Sign In'
        })
    }  
    // sign in user and redirect page on the basis of user type and initiate session
    async postSignIn(req, res) {
        try {
            const {email, password, account_type} = req.body
            const user = await User.findOne({ email: email })
            if (!user) {
                return res.status(404).json({error: "Invalid user name"})
            }
            const passwordMatch = await bcrypt.compare(password, user.password) 
            if (!passwordMatch) {
                return res.status(404).json({error: "Invalid Password"})
            }
            if (passwordMatch && account_type === user.account_type && user.status === 'active') {
                const token = jwt.sign({
                    userId: user._id,
                    userEmail: user.email,
                    userType: user.account_type
                }, process.env.JWT_SECRET,
                    {
                        expiresIn: "1h"
                    }
                )
                let redirect = "/admin/companies"
                req.session.userType = user.account_type
                req.session.save()
                res.cookie('jwt', token, { httpOnly: true })
                return res.status(200).json({success:true, message:"Login successful", token:token, redirect:redirect})   
            }else {
                return res.status(404).json({error: "Invalid user."})
            }

        } catch (err) {
            console.log("Error while log in", err)
            return res.status(500).json({error:"Internal server error."})
        }
    }
    // get signuppage with position and department name
    async getSignUp(req, res) {
        try {
            const department = await Dept.find()
            const position = await Pos.find({ department: department[0]._id })
            return res.render('sign_up', {
                title: 'Add employee',
                position: position,
                department: department
            })
        }catch (err) {
            console.log("Error while getting the signUp page", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/signIn'
            </script>`)
        }
    }
    // signup user
    async postSignUp(req, res) {
        try {
            const password = passGen.passGen(12)
            const encPassword = await passGen.crypt(password)
            if (!encPassword) {
                res.status(500).json({ error: "Unable to create user." });
            }
            const userType = 'admin'
            const status = 'active'
            const email = (req.body.email).trim()
            const newUser = await User.create({
                first_name: req.body.fName,
                last_name: req.body.lName,
                email: email,
                password: encPassword,
                account_type: userType,
                contact_no: req.body.contact,
                employee_id: req.body.empid,
                date_of_birth:req.body.dob,
                gender: req.body.gender,
                department: req.body.dept,
                position: req.body.position,
                highest_qualification: req.body.qualification,
                status:status
            })   
            return res.status(200).json({
                success: true,
                message:"Employee added successfully"
            })
        } catch (err) {
            console.log("Error while signup the user", err)
            return res.status(500).json({error:"Internal server error."})
        }
    }
    // get reset password page
    getResetPassword(req, res) {
        return res.render('forgot_password', {
            title:"Forgot Password"
        })
    }
    // reset password
    async postResetPassword(req, res) {
        try {
            const email = (req.body.email).trim()
            const password = (req.body.newPassword)
            const encPassword = await passGen.crypt(password)
            if (!encPassword) {
                res.status(500).json({ error: "Unable to create user." });
            }
            const user = await User.findOneAndUpdate({ email: email }, { $set: { password: encPassword } })
            if (user) {
                return res.status(200).json({success:true,message:"Your password gets updated."})
            } else {
                return res.status(200).json({success:true,message:"Invalid user."})
            }
        }catch (err) {
            console.log("Error while resetting the password post.", err)
            return res.status(500).json({error:"Internal server error."})
        }
    }
    // logout and clear session
    async postLogout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err)
            } else {
                return res.status(401)
                .send(`<script>
                alert('Successfully logged out.');
                    window.location.href = '/signIn';
                    </script>`)
            }
        })
        return res.clearCookie('jwt')
    }
    // get jobs
        async getJobs(req, res) {
        try {
            const jobs = await getJobData()
            return res.render('jobs', {
                title: 'View Jobs',
                jobs:jobs.results
            })    
        } catch (err) {
            console.error("Error occured while getting the jobs", err)
            return res.status(500).send(`<script>
            alert("Internal server error")
            window.location.href = '/'
            </script>`)
        }
    }
}