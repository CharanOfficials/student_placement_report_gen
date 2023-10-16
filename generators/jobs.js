import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'

const apiKey = process.env.API_KEY
const appKey = process.env.APP_KEY
const jobTitle = 'MERN'
const location = 'in'
const results_per_page = 15
const profile = 'javascript developer'
const what_exclude = 'java'
const sort_by = 'salary'
const max_days_old = 3

const getJobData = async () => {
    try {
        const adzunaAPIURL = `https://api.adzuna.com/v1/api/jobs/${location}/search/1?app_id=${apiKey}&app_key=${appKey}&results_per_page=${results_per_page}&what=${profile}&what_exclude=${what_exclude}&max_days_old=${max_days_old}&sort_by=${sort_by}&full_time=1&permanent=1`;
        
        const response = await axios.get(adzunaAPIURL, { headers: { 'Content-Type': 'application/json' } });
        
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Error: HTTP status ${response.status}`);
        }
    } catch (err) {
        console.error('Error fetching job listings:', err);
    }
}

export default getJobData