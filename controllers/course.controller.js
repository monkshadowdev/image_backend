// Import necessary modules
import { Course } from '../models/course.model.js'; // Assuming Course is exported from Doctor.js
import sharp from 'sharp';

// Add a new course entry
export const addCourse = async (req, res) => {
    try {
        const { 
            courseName, 
            parentCourseId, 
            duration, 
            description, 
            thumbnail, 
            nextBatchStartDate, 
            isDemoAvailable, 
            difficulty,
            mode,
            thisCourseIsFor,
            softwares, 
            mentors,
            isClubCourse, 
            modules,
            assignments,
            courseEnabled, 
            others, 
            userId 
        } = req.body;

        if (!thumbnail || !thumbnail.startsWith('data:image')) {
            return res.status(400).json({ message: 'Invalid image data', success: false });
        }

        const base64Data = thumbnail.split(';base64,').pop();
        const buffer = Buffer.from(base64Data, 'base64');

        // Resize and compress the image using sharp
        const compressedBuffer = await sharp(buffer)
            .resize(800, 600, { fit: 'inside' }) // Resize to 800x600 max, maintaining aspect ratio
            .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
            .toBuffer();

        // Convert back to Base64 for storage (optional)
        const compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;

        const course = new Course({
            courseName,
            parentCourseId,
            duration,
            description,
            thumbnail: compressedBase64,
            nextBatchStartDate,
            isDemoAvailable,
            difficulty,
            mode,
            thisCourseIsFor,
            softwares,
            mentors,
            isClubCourse,
            modules,
            assignments,
            courseEnabled,
            others,
            userId
        });

        await course.save();
        res.status(201).json({ course, success: true });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ message: 'Failed to add course', success: false });
    }
};

// Get all course entries
export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        if (!courses) {
            return res.status(404).json({ message: "Courses not found", success: false });
        }
        return res.status(200).json({ courses, success: true });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Failed to fetch courses', success: false });
    }
};

// Get course by ID
export const getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found!", success: false });
        }
        return res.status(200).json({ course, success: true });
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        res.status(500).json({ message: 'Failed to fetch course', success: false });
    }
};

// Update course by ID
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            courseName, 
            parentCourseId, 
            duration, 
            description, 
            thumbnail, 
            nextBatchStartDate, 
            isDemoAvailable,
            difficulty,
            mode,
            thisCourseIsFor, 
            softwares,
            mentors, 
            isClubCourse, 
            modules,
            assignments,
            courseEnabled, 
            others, 
            userId 
        } = req.body;

        let compressedBase64;
        if (thumbnail) {
            if (!thumbnail.startsWith('data:image')) {
                return res.status(400).json({ message: 'Invalid image data', success: false });
            }

            const base64Data = thumbnail.split(';base64,').pop();
            const buffer = Buffer.from(base64Data, 'base64');

            // Resize and compress the image using sharp
            const compressedBuffer = await sharp(buffer)
                .resize(800, 600, { fit: 'inside' }) // Resize to 800x600 max, maintaining aspect ratio
                .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
                .toBuffer();

            compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
        }

        const updatedData = {
            courseName,
            parentCourseId,
            duration,
            description,
            ...(compressedBase64 && { thumbnail: compressedBase64 }),
            nextBatchStartDate,
            isDemoAvailable,
            difficulty,
            mode,
            thisCourseIsFor,
            softwares,
            mentors,
            isClubCourse,
            modules,
            assignments,
            courseEnabled,
            others,
            userId
        };

        const course = await Course.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
        if (!course) {
            return res.status(404).json({ message: "Course not found!", success: false });
        }
        return res.status(200).json({ course, success: true });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(400).json({ message: 'Failed to update course', success: false });
    }
};

// Delete course by ID
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndDelete(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found!", success: false });
        }
        return res.status(200).json({ course, success: true });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Failed to delete course', success: false });
    }
};

export const cloneCourse = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the service to clone
        const courseToClone = await Course.findById(id);
        if (!courseToClone) {
            return res.status(404).json({ message: "Course to clone not found!", success: false });
        }

        // Remove the _id field to avoid duplication error
        const clonedData = { ...courseToClone.toObject() };
        delete clonedData._id;

        // Generate a new unique serviceName
        let newCourseName = courseToClone.courseName;
        let suffix = 1;

        while (await Course.findOne({ courseName: newCourseName })) {
            suffix++;
            newCourseName = `${courseToClone.courseName}-${suffix}`;
        }

        clonedData.courseName = newCourseName;

        // Create a new service with the cloned data
        const clonedCourse = new Course(clonedData);
        await clonedCourse.save();

        return res.status(201).json({ clonedCourse, success: true });
    } catch (error) {
        console.error('Error cloning course:', error);
        res.status(500).json({ message: 'Failed to clone course', success: false });
    }
};
