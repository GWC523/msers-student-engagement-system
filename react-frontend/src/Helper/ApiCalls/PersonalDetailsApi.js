import { getAPICall, postAPICall, putAPICall, deleteAPICall } from './AxiosMethodCalls';

//GET
export const getAllStudents = async () => {
    try {
        const response = await getAPICall(process.env.REACT_APP_LINK + 'student-list');
        return ({data:response});   
    } catch (error) {
        return ({error: error.response});
    }
}

export const getStudent = async (studentId) => {
    try {
        const response = await getAPICall(process.env.REACT_APP_LINK + 'student-detail/' + studentId);
        return ({data:response});   
    } catch (error) {
        return ({error: error.response});
    }
}

//POST
export const createStudent = async (info) => {
    try {
        const response = await postAPICall(process.env.REACT_APP_LINK + 'student-create/', {
            student_id: info.student_id,
            name: info.name,
            age: info.age,
            gender: info.gender,
            year_level: info.year_level,
            program: info.program
        });
        return ({data:response});   
    } catch (error) {
        return ({error: error.response});
    }
}

//DELETE
export const deleteStudent = async (studentId) => {
    try {
        const response = await getAPICall(process.env.REACT_APP_LINK + 'student-delete/' + studentId);
        return ({data:response});   
    } catch (error) {
        return ({error: error.response});
    }
}