import React from 'react'
import Link from 'gatsby-link'
import Img from "gatsby-image"
import { graphql } from "gatsby"
import Layout from '../components/layout'

export default function Template({data}) {
    const product = data.product
    return (
      <Layout>
        <div key={product.id}
          style={{
            display: `flex`,
            flexDirection: `column`,
            padding: 16,
            border: `1px solid #ccc`,
          }}
        >
            <Link to="/" style={{ textDecoration: 'underline' }}>Go Back</Link>
            <br />
            <h2>{product.shortDescription}</h2>
            <span>ERP#: {product.erpNumber}</span>
            <span>UOM: {product.unitOfMeasureDisplay}</span>
            <span>Price: {product.pricing.actualPriceDisplay}</span>
            <span>Category: {product.category.shortDescription}</span>
            {(product.remoteImage===null ? (<span>No Image</span>) : (<Img
              fluid={product.remoteImage.childImageSharp.fluid}
            />))}
        </div>
      </Layout>
    )
}

export const query = graphql`
  query ProductByUrl($path: String!) {
    product(productDetailUrl: {eq: $path}) {
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
`