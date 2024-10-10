### Introduction
This is the system, Engager, a visual analytics system to help teachers analyze multimodal and multifaceted data to understand student engagement regarding teaching context in online teaching videos.
The whole system is composed of the backend and frontend. For the backend, we use python, and for the frontend, we use javascript, vue and flask.

### Data Processing
1. We first need to clip videos into different sessions. Furthermore, different participants should be extract individually.
2. We have used multiple existing approaches to extract features from each video clip, we have provided links to the corresponding algorithms:
(1) Emotion valence & arousal: Emotion valence describes the extent to which an emotion is positive or negative, whereas arousal refers to its intensity.
```
https://github.com/deepcam-cn/yolov5-face
```
(2) Smile (laugh): The smile or laugh behavior often relates to rapport.
```
https://github.com/meng1994412/Smile-Detection
```
(3) Head nodding & shaking: Head nodding and shaking are regarded as strong signs showing consensus (agreement/disagreement) and understanding.
```
https://github.com/Heng-Robotics/Nonverbal-Behaviors-Detection
```
(4) Hand movements: The frequency of changing hand positions, which may indicate one person’s behavioral activeness.
```
https://github.com/cansik/yolo-hand-detection
```
(5) Look down: The change of the eye gaze direction, which may indicate that one person is occupied with other things.
```
https://github.com/cmusatyalab/openface
```
(6) Lean towards & backward the screen: The distance change between one person and the screen. Leaning to the screen may indicate the willingness of involvement, while backward leaning often indicates a decrease in satisfaction.
```
https://github.com/cmusatyalab/openface
```
(7) Speaker turn taking: show which person speaks after whom.
```
https://github.com/pyannote/pyannote-audio
```
(8) Amount of speaking time: show how much a person talk where increasing speaking time is a sign of dominance.
```
Directly perform statistics.
```
(9) Volume variation: The variation of the speaker’s voice loudness: softer or louder.
```
https://github.com/praat/praat
```
(10) Pitch variation: The variation of the speaker’s tone: raised pitch or lower pitch.
```
https://github.com/praat/praat
```
(11) Text response: The timestamp and text content sent in the chatbox.
```
Directly perform statistics.
```
3. We also used labeling data from the experts. The engagement score of each video clip should be labeled.

### Frontend Setup
To run the front end, you can execute the following code.
1. set up frontend
```
cd frontend
npm install
npm run serve
```

2. set up backend
```
cd backend
python run-data-backend.py
```

### Environment
- vue@2.6.12
- d3v5
- python 3.7 or above
