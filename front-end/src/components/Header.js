// Header (entete)
import {Link } from 'react-router-dom';

import React from 'react';

const Header = () =>{
    return (
      <nav>
        <div className='nav-wrapper'>
        <Link to={'/'} className="brand-logo">IT courses</Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down" >
            <li><Link to={'/shop'}>Boutique</Link></li>
            <li><Link to={'/about'}>A propose de nous</Link></li>
        </ul>
        </div>
      </nav>
    )
}

export default Header;