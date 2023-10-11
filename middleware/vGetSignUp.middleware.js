// to validate department and position data availability
import Dept from '../model/department.js';
import Pos from '../model/position.js';

export const checkData = async (req, res, next) => {
    try {
        const departmentPlain = await Dept.findOne().lean();
        const department = departmentPlain ? [departmentPlain] : [];
        if (!department || department.length === 0) {
            return res.send(`
                <script>
                    alert('Please contact admin to add department');
                    window.location.href = '/';
                </script>
            `);
        }
        const positions = await Pos.findOne({ department: departmentPlain._id });
        if (!positions || positions.length === 0) {
            return res.send(`
                <script>
                    alert('Please contact admin to add position');
                    window.location.href = '/';
                </script>
            `);
        }
        
        next();
    } catch (err) {
        // Handle other errors (e.g., server error)
        console.log(err)
        res.status(500).json({ error: "Server error" });
    }
};
