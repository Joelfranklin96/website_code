import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to install axios
import DropdownMenu from '../DropdownMenu';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:3001/');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
      <a className="navbar-brand" href="/">
        <img src="/emerjence_logo.png" alt="Emerjence Logo" height="30" />
      </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {menuItems.map((menu, index) => (
              menu.children && menu.children.length > 0 ? (
                <DropdownMenu key={index} title={menu.label}>
                  {menu.children.map((child, childIndex) => (
                    <li key={childIndex}>
                      <Link 
                        to={`/content/${child.id}`}
                        state={{ content: child.content, label: child.label }}
                        className="dropdown-item"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </DropdownMenu>
              ) : (
                // Render a regular link if there are no children
                <li key={index} className="nav-item">
                  <Link to={`/content/${menu.id}`} state={{ content: menu.content, label: menu.label }} className="nav-link">
                    {menu.label}
                  </Link>
                </li>
              )
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
