import React from 'react'
import Link from 'gatsby-link'
import '../css/index.css'

const Menu = () => {
    return (
    <div
        style={{
            background: '#f4f4f4',
            margin: '0 auto',
            maxWidth: 960,
            paddingTop: '10px',
        }}
    >
        <ul
        style={{
            listStyle: 'none',
            display: 'flex',
            justifyContent: 'flex-start',
        }}
        >
        <li>
            <Link to="/">Product</Link>
        </li>
        </ul>
    </div>
)}

export default Menu