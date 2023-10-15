import SIMapper from '../model/studentInterviewMapper.model.js';
import {createObjectCsvWriter} from 'csv-writer';
import { format } from 'date-fns';

export const genData = async () => {
  try {
    const results = await SIMapper.find()
      .populate({
        path: 'interview',
        populate: {
          path: 'company',
        },
      })
      .populate({
        path: 'student',
        select: '-password',
        populate: [
          { path: 'batch' },
          { path: 'college' },
        ],
      });
    // console.log(results[0].student.subjects[0].name)
    const data = results.map((element) => ({
        studentID: element.student._id,
        studentName: element.student.name,
        studentCollege: element.student.college.name,
        studentStatus: element.student.placement_status,
        studentDsaScore: element.student.subjects[0].scores,
        studentWebDScore: element.student.subjects[1].scores,
        studentReactScore: element.student.subjects[2].scores,
        studentInterviewName: element.interview.profileName,
        studentInterviewDate: format(new Date(element.interview.date), 'MM/dd/yyyy'),
        studentInterviewCompany: element.interview.company.name,
        studentInterviewResult: element.status,
    }))

    const csvWriter = createObjectCsvWriter({
      path: './csv/studentsResults.csv',
      header: [
        { id: 'studentID', title: 'Student ID' },
        { id: 'studentName', title: 'Student Name' },
        { id: 'studentCollege', title: 'Student College' },
        { id: 'studentStatus', title: 'Student Status' },
        { id: 'studentDsaScore', title: 'DSA Score' },
        { id: 'studentWebDScore', title: 'Web Development Score' },
        { id: 'studentReactScore', title: 'React Score' },
        { id: 'studentInterviewName', title: 'Interview Name' },
        { id: 'studentInterviewDate', title: 'Interview Date' },
        { id: 'studentInterviewCompany', title: 'Interview Company' },
        { id: 'studentInterviewResult', title: 'Interview Result' },
      ],
    })

    await csvWriter.writeRecords(data)
  } catch (error) {
    console.error('Error:', error);
  }
};
