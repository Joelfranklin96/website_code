import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ContentPage from './components/ContentPage';
import ContactWidget from './components/ContactWidget';
import { fetchContentById } from './services/api'; // Ensure this is correctly imported
import backgroundImage from './assets/Sunrise.jpg'; 

function App() {
  const [mainContent, setMainContent] = useState('Loading content...');

  useEffect(() => {
    const getContent = async () => {
      try {
        const { content, label } = await fetchContentById('HOME');
        //console.log(content, label);
        if (content) {
          setMainContent(content);
          document.title = label; // Optionally set the document title to the fetched label
        } else {
          setMainContent('No content available'); // Set a default message if no content is found
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
        setMainContent('Content not found'); // Set fallback content on error
      }
    };

    getContent();
  }, []);

  return (
    <div className="background-image" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Router>
        <Navbar />
        <ContactWidget />
        <Routes>
          <Route path="/" element={<div className="content-padding" dangerouslySetInnerHTML={{ __html: mainContent }} />} />
          <Route path="/content/:itemId" element={<ContentPage />} />
          {/* Additional routes can be added here */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
