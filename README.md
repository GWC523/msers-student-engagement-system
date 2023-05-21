
# MULTIDIMENSIONAL STUDENT ENGAGEMENT RECOGNITION SYSTEM (MSERS): MEASURING STUDENT ENGAGEMENT LEVEL IN ONLINE CLASS DISCUSSIONS

 ![image](https://github.com/GWC523/msers-student-engagement-system/assets/56357171/b2e097be-c2fe-42ee-807f-4c71a4440f6d)

One of the key concepts used to examine how students behave in relation to the teaching and learning process is student engagement. Understanding how students behave in educational settings will give a sense of the rules and academic practices. Thus, this ongoing study aims to develop a novel student engagement detector that covers the three dimensions of engagement: behavioral, emotional, and cognitive engagement in real-time using existing computer- vision algorithms as its foundation and assess the accuracy of this developed integrated system in a synchronous online discussion. The main source of data for evaluation are the self-reported questionnaire and system-detected results that were  collected during the online classes conducted by the volunteering lecturers at the University of the Philippines Cebu.


# MSERS ARCHITECTURE

<img width="668" alt="image" src="https://github.com/GWC523/msers-student-engagement-system/assets/56357171/2d293dd7-9886-46a3-b206-dc9d1a29cb39">


The above shows the software architecture that is followed in the study for the creation of the student engagement detector. There are four categories for input data: eye gaze recognition input, emotion recognition input, gesture recognition input, and talking recognition input. The eye gaze recognition input contains facial data. The emotion recognition also contains facial data that was preprocessed using facial landmark detection using the CNN algorithm. Meanwhile, the gesture recognition data contains the hand gesture data and was preprocessed through lower-order binary representation. Lastly, the talking recognition input contains the lip movement data.  In total, there are four input data that were extracted which are eye gaze, facial, lip movement, and hand gesture. The eye gaze data was preprocessed using the 3D face model fitting which builds a 3D face model  HOG-based method that is available in dlib.  Meanwhile, the spatial transformer network was used to preprocess the facial data, which simply tries to focus on the most important section of the image by estimating a sample across the attended region. Furthermore, lip movement data was extracted from facial data, with the lip movement data utilizing the lip distance to detect if the person is talking or not. Moreover, once the data was extracted, the detector would run its algorithm to produce an output. The generated output calculates three engagement dimensions which are emotional, behavioral, and cognitive. For emotional engagement dimension, it calculates the engagement based on the values from the facial emotion detector. By multiplying the Dominant Emotion Probability (DEP) value by the corresponding weight, a term based on the  weight-based method used by the study by Sharma et al., (2019) , we will get the emotional engagement percentage. For behavioral engagement, the eye gaze probability, emotion probability, gesture probability, and the talking probability was considered for the calculation of the percentage by multiplying them with their respective weights. Lastly, for cognitive engagement, the gesture output, eye gaze output, and the talking output was considered to calculate its percentage also by multiplying them with their respective weights.   


# TESTING SITE 
https://msers.site/

## License 📄

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Author

Gwyneth Chiu - https://github.com/GWC523



