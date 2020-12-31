import React from "react"
import Link from 'gatsby-link'
import Layout from "../components/layout"

export default function About() {
  return (
    <Layout>
      <h1>oops ...</h1>
      <p>
        Sorry, the page you are looking for doesn't exists.
      </p>
      <Link to="/" style={{ textDecoration: 'underline' }}>Go to Home Page</Link>
    </Layout>
  );
}