// validate performance id
import Performance from "../model/performance.js";
export const validatePerfId = async (req, res, next)=>{
    if (req.query.perf_id) {
    let perf_id = req.query.perf_id.trim()
        if (perf_id.length === 24) {
            try {
                const perf = await Performance.findById(req.query.perf_id)
                if (!perf) {
                    return res.status(404).send(`<script>
                    alert("Invalid Performance details.")
                    window.location.href = '/admin/employees'
                    </script>`)
                }
            } catch (err) {
                console.log("Error in vUserIdMiddleware", err)
                res.status(500).send('<script>alert("Internal Server Error")</script>')
            }
        } else {
            return res.status(404).send(`<script>
                alert("Invalid Performance details.")
                window.location.href = '/admin/employees'
            </script>`)
        }
    }
    next()
}