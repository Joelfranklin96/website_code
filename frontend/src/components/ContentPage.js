import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './ContentPage.css';

function ContentPage() {
  const location = useLocation();
  const { content, label } = location.state || { content: 'Content not found', label: 'Untitled' };
  const safeContent = DOMPurify.sanitize(content);

  useEffect(() => {
    // Set the document title to the label
    document.title = label;
  }, [label]);

  return (
    <div className="content-container">
      <div dangerouslySetInnerHTML={{ __html: safeContent }} />
    </div>
  );
}

export default ContentPage;