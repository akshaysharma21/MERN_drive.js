import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class navbar extends Component{

    render() {
        return(
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">Image Repository</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="navbar-item">
                            <Link to="/upload" className="nav-link">Upload Images</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/" className="nav-link">Gallery</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/user" className="nav-link">Sign in</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/signup" className="nav-link">Create User</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}