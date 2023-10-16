# Student Placement Report Generator

## Introduction

This project is dedicated to providing users with a comprehensive list of the latest full-stack job opportunities. Its functionality extends to enabling users to perform various tasks, including creating and managing superusers/administrators, editing user profiles, adding students, and registering companies for recruitment purposes. Users can effectively schedule and manage interviews, facilitating seamless student registration.

Moreover, superusers are empowered to update interview statuses for each student involved in these interviews. They can also conveniently download a comprehensive dataset containing all student-related information, including interview details.

## Prerequisites
- Node.js
- MongoDB

## Installation

To install the project, you can use npm with the following command:

1. Clone the repository: `git clone https://github.com/CharanOfficials/student_placement_report_gen/`
2. Install dependencies: `npm install

## Configuration

1. Create a `.env` file and set the following variables:
   - `JWT_SECRET`: Your secret key for authentication
   - `DB_URL`: Your MongoDB connection string
   - `API_KEY`: Your adzuna api key for jobs api
   - `APP_KEY`: Your adzuna app key for jobs api

## Features

1. Register New Employees: Easily add new employees to your system, keeping track of their essential details.
2. Register Companies: Register and manage company profiles, facilitating connections with potential employers.
3. Register Students: Create student profiles, including academic and personal information, for efficient student management.
4. Create Interviews: Schedule and organize interviews with candidates, streamlining the hiring process.
5. Add Interview Results: Record and manage interview results and feedback, making informed hiring decisions.
6. Download Data Files: Seamlessly export and download data files for further analysis and reporting.
7. View Latest Full Stack Jobs: Stay updated with the latest Full Stack job opportunities, helping students and job seekers find the right employment.

## Usage


In the "Manage Employees" menu, you can:

1. Add Department: Easily create new departments within the "Manage Employees" section.
2. Register Position: Register new positions linked to the previously added departments, ensuring organized job roles.
3. Add Employee: Register new employees under their respective departments and positions. The positions are automatically populated based on the chosen department.
4. View Employees: Access a comprehensive list of all registered employees. To update employee information, simply click the "Edit" button located in the last column of the table.

Within the "Manage Students" menu you can:

1. Add College: Expand your database of educational institutions by inputting new college details, enhancing the system's versatility.
2. Add Batch: Keep your student data organized by recording specific batch details, simplifying categorization.
3. Add Student: Register students while ensuring they meet the qualification criteria, which requires a score between 70 and 100. This ensures that only eligible students are added, maintaining data accuracy.

In the Manage Interviews menu, you can:

1. Add Company: Register new companies to the system, simplifying partner and employer management.
2. View Companies: Access a comprehensive list of all registered companies, including details about the total number of interviews associated with each company.
    - `Create Interview`: Create new interviews for a selected company, streamlining the process of scheduling and organizing interviews.
    - `View Interviews`: Click on the Total Number of Interviews for any company to view the corresponding list of interviews.
    - `Register Students`: You can register students for a specific interview, but only if the interview date is in the future. This ensures data accuracy and prevents registration for past interviews. Click on the "True/False" value in the "Registered" column to easily register or deregister students for a specific interview.
    - `View Students Registered Interviews`: Click on the number of interviews to see the list of all interviews a student is registered for.

In the Add Interview Results menu, you can:

1. Add Interview Results: Record and manage interview results for candidates efficiently.
2. Add Status: To set the status of an interview, click on the "Add Status" column, and then select the desired status from the dropdown menu available under the "Select Status" column. The selected status will be reflected on the opened page.

In the Download file menu, you can:

1. Download Data: Click the "Download Data" option to retrieve a file with comprehensive information about each student. The downloaded file includes the following details:

    - Student ID
    - Student Name
    - Student College
    - Student Status
    - DSA Score
    - Web Development Score
    - React Score
    - Interview Name
    - Interview Date
    - Interview Company
    - Interview Result
  This process simplifies access to student data for analysis and reporting.

Visit the root URL (typically "/") to access a comprehensive list of all available Full Stack job openings. This allows job seekers and students to explore and find relevant employment opportunities.
