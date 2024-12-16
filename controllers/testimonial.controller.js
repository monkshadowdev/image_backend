import { Testimonial } from '../models/testimonial.model.js'; // Adjust the import to match your file structure
import cloudinary from "../utils/cloudinary.js";  // Assuming you want to upload images to Cloudinary (you can remove if not needed)
import getDataUri from "../utils/datauri.js";  // Same as above
import sharp from 'sharp';

// Add a new testimonial
export const addTestimonial = async (req, res) => {
    try {
        const { name, description, imageBase64, courseId, showForAll,userId } = req.body;


        // Validate base64 image data
        if (!imageBase64 || !imageBase64.startsWith('data:image')) {
            return res.status(400).json({ message: 'Invalid image data', success: false });
        }

        const base64Data = imageBase64.split(';base64,').pop();
        const buffer = Buffer.from(base64Data, 'base64');

        // Resize and compress the image using sharp
        const compressedBuffer = await sharp(buffer)
            .resize(800, 600, { fit: 'inside' }) // Resize to 800x600 max, maintaining aspect ratio
            .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
            .toBuffer();

        // Convert back to Base64 for storage (optional)
        const compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;

        // Create and save the testimonial details in MongoDB
        const testimonial = new Testimonial({
            name,
            description,
            image: compressedBase64,  // Store the base64 string (or you could upload to Cloudinary)
            courseId,
            showForAll,
            userId
        });

        await testimonial.save();
        res.status(201).json({ testimonial, success: true });
    } catch (error) {
        console.error('Error adding testimonial:', error);
        res.status(500).json({ message: 'Failed to add testimonial', success: false });
    }
};

// Get all testimonials
export const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        if (!testimonials) return res.status(404).json({ message: "Testimonials not found", success: false });
        return res.status(200).json({ testimonials });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch testimonials', success: false });
    }
};

// Get testimonial by ID
export const getTestimonialById = async (req, res) => {
    try {
        const testimonialId = req.params.id;
        const testimonial = await Testimonial.findById(testimonialId);
        if (!testimonial) return res.status(404).json({ message: "Testimonial not found!", success: false });
        return res.status(200).json({ testimonial, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch testimonial', success: false });
    }
};

// Update testimonial by ID
export const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, imageBase64, courseId, showForAll,userId } = req.body;

        // Validate base64 image data if provided
        if (imageBase64 && !imageBase64.startsWith('data:image')) {
            return res.status(400).json({ message: 'Invalid image data', success: false });
        }

        const base64Data = imageBase64.split(';base64,').pop();
        const buffer = Buffer.from(base64Data, 'base64');

        // Resize and compress the image using sharp
        const compressedBuffer = await sharp(buffer)
            .resize(800, 600, { fit: 'inside' }) // Resize to 800x600 max, maintaining aspect ratio
            .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
            .toBuffer();

        // Convert back to Base64 for storage (optional)
        const compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;

        const updatedData = {
            name,
            description,
            courseId,
            showForAll,
            userId,
            ...(compressedBase64 && { image: compressedBase64 }) // Update image only if a new image is provided
        };

        const testimonial = await Testimonial.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
        if (!testimonial) return res.status(404).json({ message: "Testimonial not found!", success: false });
        return res.status(200).json({ testimonial, success: true });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message, success: false });
    }
};

// Delete testimonial by ID
export const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await Testimonial.findByIdAndDelete(id);
        if (!testimonial) return res.status(404).json({ message: "Testimonial not found!", success: false });
        return res.status(200).json({ testimonial, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to delete testimonial', success: false });
    }
};

