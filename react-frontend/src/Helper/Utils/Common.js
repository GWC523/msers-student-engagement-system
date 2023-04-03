/***************************
 * Local Storage Utilities
 ***************************/

//return user data from local storage
export const getParticipantId = () => {
  const participantStr = localStorage.getItem("participant_id");
  if (participantStr) return JSON.parse(participantStr);
  else return null;
};

export const getStudentId = () => {
  const studentStr = localStorage.getItem("student_id");
  if (studentStr) return JSON.parse(studentStr);
  else return null;
};

export const getCameraPermisions = () => {
  const grantedStr = localStorage.getItem("camera_granted");
  if (grantedStr) return JSON.parse(grantedStr);
  else return null;
};