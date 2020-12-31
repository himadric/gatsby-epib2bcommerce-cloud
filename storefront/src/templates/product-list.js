import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import Link from "gatsby-link"
import Layout from "../components/layout"

export default function Template({data}) { 
    return (
    <Layout>
      <div>
      <h1>{`${data.allProduct.nodes.length} Products in Category ${data.allProduct.nodes[0].category.shortDescription}`}</h1>
      <Link to="/" style={{ textDecoration: 'underline' }}>Go Back</Link>
      <br />
      <br />
      <section
        style={{
          display: `grid`,
          gridTemplateColumns: `repeat( auto-fit, minmax(250px, 1fr) )`,
          gridGap: 16,
        }}
      >
        {data.allProduct.nodes.map(product => (
          <div key={product.id}
            style={{
              display: `flex`,
              flexDirection: `column`,
              padding: 16,
              border: `1px solid #ccc`,
            }}
          >
            <Link to={product.productDetailUrl}><h2>{product.shortDescription}</h2></Link>
            <span>ERP#: {product.erpNumber}</span>
            <span>UOM: {product.unitOfMeasureDisplay}</span>
            <span>Price: {product.pricing.actualPriceDisplay}</span>
            {(product.remoteImage===null ? (<span>No Image</span>) : (<Img
              fluid={product.remoteImage.childImageSharp.fluid}
            />))}
          </div>
        ))}
      </section>
    </div>
  </Layout>
)}

export const query = graphql`
  query ProductsByCategory($categoryid: String!) {
    allProduct(filter: {parent: {id: {eq: $categoryid}}}) {
        nodes {
            id
            erpNumber
            shortDescription
            productDetailUrl
            unitOfMeasureDisplay
            pricing {
                actualPriceDisplay
            }
            category {
                id
                shortDescription
            }
            parent {
                id
            }
            remoteImage {
                id
                childImageSharp {
                    fluid {
                    ...GatsbyImageSharpFluid
                    }
                }
            }
        }
    }
  }
`
