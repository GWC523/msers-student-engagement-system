import { getAPICall, postAPICall, putAPICall, deleteAPICall } from './AxiosMethodCalls';



//POST
export const createSelfReportEngagement = async (info) => {
    try {
        const response = await postAPICall(process.env.REACT_APP_LINK + 'engagement-create/', {
            student_id: info.student_id,
            participant_id: info.participant_id,
            slide_no: info.slide_no,
            q1: info.q1,
            q2: info.q2,
            q3: info.q3,
            q4: info.q4,
            q5: info.q5,
            q6: info.q6,
            q7: info.q7,
            q8: info.q8,
            q9: info.q9,
            q10: info.q10,
            q11: info.q11,
            q12: info.q12,
        });
        return ({data:response});   
    } catch (error) {
        return ({error: error.response});
    }
}

//POST
export const createSelfReportInfo = async (info) => {
    try {
        const response = await postAPICall(process.env.REACT_APP_LINK + 'selfreport-info-create/', {
            student_id: info.student_id,
            participant_id: info.participant_id,
            environment: info.environment,
            lighting_condition: info.lighting_condition,
            camera_spec: info.camera_spec,
            computer_spec: info.computer_spec
        });
        return ({data:response});   
    } catch (error) {
        return ({error: error.response});
    }
}
