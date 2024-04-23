//ContactForm.js
import React, { useState } from 'react';
import axios from 'axios'; // Make sure axios is installed and imported
import './ContactForm.css';

function ContactForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false); // State to track if form is submitted

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      await axios.post('http://localhost:3001/api/contact', formData);
      setIsSubmitted(true); // Set isSubmitted to true after successful form submission
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="thank-you-message">
        <p>Thank you for contacting us! We will get back to you soon.</p>
      </div>
    );
  }

  return (
    <div className="contact-form">
      <button onClick={onClose} className="close-btn">Close</button>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          required
          value={formData.message}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default ContactForm;
