import { handleValidationChange } from './Common'

//Required
    // name: "",
    // student_id: "",
    // age: "",
    // gender: "",
    // year_level: "",
    // program: ""

export const ValidateForm = (
    data,
    setIsError
) => {

    var isValid = true;

    if(data.name === "") {
        handleValidationChange("name", true, setIsError);
        isValid = false;
    } else {
        handleValidationChange("name", false, setIsError);
    }

    if(data.student_id === "") {
        handleValidationChange("student_id", true, setIsError);
        isValid = false;
    } else {
        handleValidationChange("student_id", false, setIsError);
    }

    if(data.age === "") {
        handleValidationChange("age", true, setIsError);
        isValid = false;
    } else {
        handleValidationChange("age", false, setIsError);
    }

    if(data.gender === "") {
        handleValidationChange("gender", true, setIsError);
        isValid = false;
    } else {
        handleValidationChange("gender", false, setIsError);
    }

    if(data.year_level === "") {
        handleValidationChange("year_level", true, setIsError);
        isValid = false;
    } else {
        handleValidationChange("year_level", false, setIsError);
    }

    if(data.program === "") {
        handleValidationChange("program", true, setIsError);
        isValid = false;
    } else {
        handleValidationChange("program", false, setIsError);
    }

    return isValid
}