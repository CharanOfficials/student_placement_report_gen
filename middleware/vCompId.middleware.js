// validate user id when user id received in query params
import Company from "../model/company.model.js";
export const validateCompId = async (req, res, next) => {
    let comp_id = req.query.comp_id
    comp_id = comp_id.trim()
    if (comp_id.length !== 24) {
        return res.status(404).send(`<script>
            alert("Invalid Company")
            window.location.href = '/admin/companies'
        </script>`)
    }
    const validate = await Company.findById(comp_id);
    if (!validate) {
        return res.status(404).send(`<script>
            alert("Invalid User")
            window.location.href = '/admin/companies'
        </script>`)
    }
    next()
}