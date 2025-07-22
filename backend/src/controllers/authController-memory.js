const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory storage for users (temporary solution)
let users = [];
let userIdCounter = 1;

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, specialty, qualification, experience } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate employee number for doctors
    let employeeNumber = null;
    if (role === 'doctor') {
      employeeNumber = `DOC${Date.now().toString().slice(-6)}`;
    }
    
    // Create new user
    const newUser = {
      id: userIdCounter++,
      name,
      email,
      password: hashedPassword,
      role: role || 'patient',
      phone,
      employeeNumber,
      specialty: role === 'doctor' ? specialty : null,
      qualification: role === 'doctor' ? qualification : null,
      experience: role === 'doctor' ? experience : null,
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    // Send welcome email (simulated)
    try {
      await sendWelcomeEmail(newUser);
    } catch (emailError) {
      console.warn('Failed to send welcome email:', emailError.message);
    }
    
    console.log('User registered:', { 
      id: newUser.id, 
      name: newUser.name, 
      email: newUser.email, 
      role: newUser.role,
      employeeNumber: newUser.employeeNumber
    });
    
    res.status(201).json({ 
      message: 'User registered successfully! Welcome email sent.',
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role,
        employeeNumber: newUser.employeeNumber,
        specialty: newUser.specialty,
        qualification: newUser.qualification,
        experience: newUser.experience
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: err.message });
  }
};

// Simulated email service
const sendWelcomeEmail = async (user) => {
  // In a real application, you would use a service like SendGrid, Nodemailer, etc.
  const emailContent = {
    to: user.email,
    subject: 'Welcome to DigitalClinic - Your Healthcare Journey Starts Here!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🏥 Welcome to DigitalClinic!</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <h2 style="color: #333; margin-top: 0;">Dear ${user.name},</h2>
          
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Thank you for registering with DigitalClinic! We're excited to have you join our healthcare community.
          </p>
          
          ${user.role === 'doctor' ? `
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1976d2; margin-top: 0;">👨‍⚕️ Doctor Account Details</h3>
              <p style="margin: 5px 0; color: #333;"><strong>Employee Number:</strong> ${user.employeeNumber}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Specialty:</strong> ${user.specialty}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Qualification:</strong> ${user.qualification}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Experience:</strong> ${user.experience} years</p>
            </div>
          ` : ''}
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">🌟 What's Next?</h3>
            <ul style="color: #856404; line-height: 1.8;">
              <li>Complete your profile for better experience</li>
              <li>${user.role === 'doctor' ? 'Set up your availability and start accepting appointments' : 'Browse doctors and book your first appointment'}</li>
              <li>Explore our comprehensive healthcare services</li>
              <li>Access your personalized dashboard</li>
            </ul>
          </div>
          
          <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0c5460; margin-top: 0;">💬 Need Help?</h3>
            <p style="color: #0c5460; margin: 0;">
              Our support team is here to help you 24/7! Feel free to reach out to us anytime:
            </p>
            <ul style="color: #0c5460; line-height: 1.6;">
              <li>📧 Email: support@digitalclinic.com</li>
              <li>📞 Phone: +91-9876543210</li>
              <li>💬 Live Chat: Available on our website</li>
              <li>🕐 Support Hours: 24/7 availability</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Login to Your Account</a>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            Best regards,<br>
            <strong>The DigitalClinic Team</strong><br>
            <em>"Your Health, Our Priority"</em>
          </p>
        </div>
      </div>
    `
  };
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('Welcome email sent to:', user.email);
  console.log('Email content:', emailContent.subject);
  
  return true;
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    console.log('User logged in:', { id: user.id, name: user.name, email: user.email });
    
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, role: user.role, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone } = req.body;
    
    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user
    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;
    if (phone) users[userIndex].phone = phone;
    
    const updatedUser = users[userIndex];
    
    res.json({ 
      message: 'Profile updated', 
      user: { 
        id: updatedUser.id, 
        name: updatedUser.name, 
        email: updatedUser.email, 
        phone: updatedUser.phone, 
        role: updatedUser.role 
      } 
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(400).json({ error: err.message });
  }
};

// Helper function to get all users (for debugging)
exports.getAllUsers = (req, res) => {
  const safeUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    createdAt: user.createdAt
  }));
  res.json(safeUsers);
};
