import React from 'react';

const NavItem = ({ title }) => {
  return (
    <li className="nav-item">
      <a className="nav-link" href="#">{title}</a>
    </li>
  );
};

export default NavItem;
