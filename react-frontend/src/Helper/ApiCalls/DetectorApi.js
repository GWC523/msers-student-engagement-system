import { getAPICall, postAPICall, putAPICall, deleteAPICall } from './AxiosMethodCalls';

//POST
export const createEngagement = async (info) => {
    try {
        const response = await postAPICall(process.env.REACT_APP_LINK + 'student-engagement-create/', {
            student_id: info.student_id,
            participant_id: info.participant_id,
            frame_data: info.frame_data,
            last_frame: info.last_frame,
            timestamp: info.timestamp,
            emotional_engagement: info.emotional_engagement,
        });
        return ({data:response});   
    } catch (error) {
        return ({error: error.response});
    }
}

