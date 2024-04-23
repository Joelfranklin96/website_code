// ContactWidget.js

import React, { useState } from 'react';
import ContactForm from '../ContactForm';
import './ContactWidget.css';

function ContactWidget() {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible); // Toggle visibility
    //console.log('Form visibility:', isFormVisible); // Debugging
  };

  return (
    <div className="contact-widget">
      <button onClick={toggleFormVisibility} className="toggle-btn">
        {isFormVisible ? 'Close' : 'Contact Us'}
      </button>

      {/* Conditionally render the ContactForm based on isFormVisible */}
      {isFormVisible && <ContactForm onClose={toggleFormVisibility} />}
    </div>
  );
}

export default ContactWidget;
