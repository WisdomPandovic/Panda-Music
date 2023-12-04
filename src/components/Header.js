import React from 'react';
import './Header.css';
import {Link} from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <div className="left-links">
          <ul>
          <li><Link to="/" className='newpost'>Home</Link></li>
            <li><Link to="/" className='newpost'>Browse</Link></li>
            <li><Link to="/search" className='newpost'>Search Albums</Link></li>
          </ul>
        </div>
        <div className="right-links">
            <li><Link to="/about" className='newpost'>About</Link></li>
            <li><Link to="/" className='newpost'>Browse</Link></li>
            <li><Link to="search" className='newpost'>Contact</Link></li>
        </div>
      </nav>
      <div className="brand">
        <span>PandaMusic</span>
      </div>
    </header>
  );
}
export default Header;