import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import Link from "gatsby-link"
import Layout from "../components/layout"

const Index = ({ data }) => (
    <Layout>
      <div>
      <h1>{`${data.allProduct.nodes.length} Products`}</h1>
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
            <span><Link to={`${product.category.id}`} style={{ textDecoration: 'underline' }}>Category: {product.category.shortDescription}</Link></span>
            {(product.remoteImage===null ? (<span>No Image</span>) : (<Img
              fluid={product.remoteImage.childImageSharp.fluid}
            />))}
            
          </div>
        ))}
      </section>
    </div>
  </Layout>
)

export const query = graphql`
  {
    allProduct {
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
export default Index