import React from 'react'
import './Navigation.css'

function Navigation() {
    return (
        <div className="navigation">
            <ul class="navigation__links">
                <li><a href="#">Current Page</a></li>
                <li><a href="#">Funding Calls</a></li>
                <li><a href="#">Shortlist</a></li>
                <li><a href="#">My Projects</a></li>
            </ul>
        </div>
    )
}

export default Navigation
