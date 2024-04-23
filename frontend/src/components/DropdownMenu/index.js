import React from 'react';

const DropdownMenu = ({ title, children }) => {
  return (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" id={`${title.toLowerCase()}Dropdown`} role="button" data-bs-toggle="dropdown" aria-expanded="false">
        {title}
      </a>
      <ul className="dropdown-menu" aria-labelledby={`${title.toLowerCase()}Dropdown`}>
        {children}
      </ul>
    </li>
  );
};

export default DropdownMenu;
