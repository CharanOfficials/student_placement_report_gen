import User from "../model/user.js"
import Feedback from '../model/feedback.js'
import Performance from "../model/performance.js"
export default class EmployeeController{
    // get all employee specific feedbacks in employee login
    async pendingFeedbacks(req, res) {
        try {
            const user = req.userID
            const userD = await User.findById(user).select('first_name last_name')
            const performances = await Performance.find({ posted_for_user: user })
                .populate('feedback', 'content')
                .populate('posted_by_user', 'first_name last_name')
            return res.render('./employee/view_pending_feedbacks', {
                menuPartial: '_emp_menu',
                title:'View Feedbacks',
                performances: performances,
                userD:userD
            })
        } catch (err){
            console.log("Error while getting the employee pending feedbacks", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/employee/home'
            </script>`)
        }
    }
    // get add feedback page
    async getFeedback(req, res) {
        try {
            const user = req.userID
            const { perf_id } = req.query
            const performance = await Performance.findById(perf_id).populate('feedback', 'content')
            const userD = await User.findById(user).select('-password')
                .populate({ path: 'department', select: 'dept_name' })
                .populate({ path: 'position', select: 'pos_name' });
            return res.render('./employee/add_feedback', {
                title: "Add Feedback",
                menuPartial: "_emp_menu",
                user: userD,
                performance:performance
            })
        } catch (err) {
            console.log("Error while getting the employee feedback.", err)
            return res.status(500).send(`<script>alert("Internal server error.")
            window.location.href = '/employee/pendingfeedbacks'
            </script>`)
        }
    }
    // add feedback against specific performance
    async postFeedback(req, res) {
        try {
            const posted_by_user = req.userID
            const p_feed = req.body.p_feed.trim()
            const {perf_id} = req.body
            const status = "active"
            if (p_feed.length === 0) {
                return res.status(400).json({error:"Invalid data."})
            }
            // const user = await User.findById(userid)
            const performance = await Performance.findById(perf_id)
            if (!performance) {
                return req.status(400).json("Invalid Performance.")
            }
            const feed = await Feedback.create({
                content: p_feed,
                performance:perf_id,
                status: status,
                posted_by_user: posted_by_user
            })
            performance.feedback = feed
            await performance.save()
            if (feed) {
                return res.status(200).json({success:true, message:"Feedback added successfully."})
            }
        }catch (err) {
            console.log("Error while submitting the feedback.", err)
            return res.status(500).json({error:"Internal server error"})
        }
    }
}