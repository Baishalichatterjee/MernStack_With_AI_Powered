const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Event = require('../models/Event');
const { OpenAI } = require('openai');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI with proper configuration
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('OpenAI initialized successfully');
} catch (error) {
  console.error('OpenAI initialization error:', error);
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Create new user
    const newUser = new User({ username, password, role });
    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit student form
router.post('/submit-student', verifyToken, async (req, res) => {
  try {
    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ error: 'Access denied. Students only.' });
    }
    
    const { name, roll, department, phone, email, club } = req.body;
    
    // Check if student already exists with same roll or email
    const existingStudent = await Student.findOne({
      $or: [{ roll }, { email }]
    });
    
    if (existingStudent) {
      return res.status(400).json({ error: 'Student with this roll number or email already exists' });
    }
    
    // Create new student
    const newStudent = new Student({ name, roll, department, phone, email, club });
    await newStudent.save();
    
    res.json({ message: 'Student information submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all students (admin only)
router.get('/students', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chatbot endpoint with OpenAI
router.post('/chat', verifyToken, async (req, res) => {
  try {
    // Check if OpenAI is properly configured
    if (!openai) {
      return res.status(500).json({ error: 'Chatbot service is not configured properly' });
    }
    
    const { prompt } = req.body;
    
    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for a college club management system. Answer questions about clubs, events, and student activities. Keep responses concise and relevant to college clubs."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    });
    
    if (!response.choices || response.choices.length === 0) {
      return res.status(500).json({ error: 'No response from AI service' });
    }
    
    res.json({ text: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // More specific error messages
    if (error.status === 401) {
      return res.status(500).json({ error: 'Invalid OpenAI API key' });
    } else if (error.status === 429) {
      return res.status(500).json({ error: 'API rate limit exceeded. Please try again later.' });
    } else if (error.status === 503) {
      return res.status(500).json({ error: 'AI service is temporarily unavailable' });
    } else if (error.code === 'insufficient_quota') {
      return res.status(500).json({ error: 'API quota exceeded. Please check your OpenAI account billing.' });
    }
    
    res.status(500).json({ error: 'Failed to get response from chatbot' });
  }
});

// Event management routes (admin only)

// Create event
router.post('/events', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    
    const { title, date, description } = req.body;
    const newEvent = new Event({ title, date, description });
    await newEvent.save();
    
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update event
router.put('/events/:id', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    
    const { title, date, description } = req.body;
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, date, description },
      { new: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete event
router.delete('/events/:id', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;