import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const NavBar = () => {
	return (
		<nav className="navbar   navbar-light bg-light">
			<Link className="navbar-brand" to="/">
				Book - App
			</Link>
			<NavLink className="nav-item nav-link" to="/search">
				Search
			</NavLink>
		</nav>
	);
};

export default NavBar;
