import React from 'react'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from "gatsby"
import Header from './header'
import '../css/index.css'

const Layout = ({ children }) => {
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
    <div>
        <Helmet
        title={data.site.siteMetadata.title}
        meta={[
            {
            name: 'description',
            content: `${data.site.siteMetadata.description}`,
            },
            { name: 'keywords', content: 'gatsby, react, jamstack, Episerver, commerce, Insite' },
        ]}
        />
        <Header siteTitle={data.site.siteMetadata.title} />
        {/* <Menu /> */}
        <div
        style={{
            margin: '0 auto',
            maxWidth: 960,
            padding: '0px 1.0875rem 1.45rem',
            paddingTop: 0,
        }}
        >
        {children}
        </div>
    </div>
)}

export default Layout
