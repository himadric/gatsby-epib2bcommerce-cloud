import React from 'react'
import Link from 'gatsby-link'
import { useStaticQuery, graphql } from "gatsby"
import '../css/index.css'

const Menu = () => {
    const data = useStaticQuery(
        graphql`
          query {
            site {
              siteMetadata {
                title
              }
            }
          }
        `
      )
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