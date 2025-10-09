import Lecture from '../models/lectureModel.js';
import Course from '../models/courseModel.js'; // Assuming courseModel exists for enrollment check

// Start live session - Educator only
export const startLiveSession = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const user = req.user; // From auth middleware

    // Check if user is educator and owns the course
    const lecture = await Lecture.findById(lectureId).populate('courseId'); // Assuming lecture has courseId
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
    if (lecture.courseId.educatorId.toString() !== user.id) {
      return res.status(403).json({ message: 'Unauthorized to start live session' });
    }

    // Generate room ID (simple UUID or timestamp-based)
    const roomId = `live_${lectureId}_${Date.now()}`;

    // Update lecture
    lecture.isLive = true;
    lecture.liveStartTime = new Date();
    lecture.liveRoomId = roomId;
    await lecture.save();

    res.json({ message: 'Live session started', roomId, startTime: lecture.liveStartTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join live session - Student only, enrolled
export const joinLiveSession = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const user = req.user; // From auth middleware

    const lecture = await Lecture.findById(lectureId).populate('courseId');
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
    if (!lecture.isLive) return res.status(400).json({ message: 'Live session not active' });

    // Check enrollment (assuming course has enrolledStudents array)
    const course = lecture.courseId;
    if (!course.enrolledStudents.includes(user.id)) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    res.json({ roomId: lecture.liveRoomId, startTime: lecture.liveStartTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// End live session - Educator only
export const endLiveSession = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const user = req.user;

    const lecture = await Lecture.findById(lectureId).populate('courseId');
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
    if (lecture.courseId.educatorId.toString() !== user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    lecture.isLive = false;
    lecture.liveRoomId = null;
    await lecture.save();

    // Emit to room via Socket.io if integrated
    res.json({ message: 'Live session ended' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
