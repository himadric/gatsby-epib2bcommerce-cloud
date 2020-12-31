
const path = require('path')

// // Replacing '/' would result in empty string which is invalid
// const replacePath = path => (path === `/` ? path : path.replace(/\/$/, ``))

// exports.onCreatePage = ({ page, actions }) => {
//   const { createPage, deletePage } = actions
//   const oldPage = Object.assign({}, page)
//   // Remove trailing slash unless page is /
//   console.log(`Page path ${oldPage.path}`)
//   page.path = replacePath(page.path)
//   if (page.path !== oldPage.path) {
//     // Replace old page with new page
//     deletePage(oldPage)
//     createPage(page)
//   }
// }

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const productTemplate = path.resolve('src/templates/product-detail.js')
  const productListTemplate = path.resolve('src/templates/product-list.js')
  
    const productDetail = graphql(`
    {
        allProduct {
            nodes {
              id
              erpNumber
              shortDescription
              productDetailUrl
              pricing {
                actualPriceDisplay
              }
              category {
                id
                shortDescription
              }
            }
        }
    }
  `).then(res => {
    if (res.errors) {
      return Promise.reject(res.errors)
    }

    res.data.allProduct.nodes.forEach( node  => {
      createPage({
        path: node.productDetailUrl,
        component: productTemplate,
      })
    })
  })

  const productList = graphql(`
  {
      allProduct {
        distinct(field: parent___id)
      }  
    }
  `).then(res => {
    if (res.errors) {
      return Promise.reject(res.errors)
    }

    res.data.allProduct.distinct.forEach( parentid  => {
      createPage({
        path: `/${parentid}`,
        component: productListTemplate,
        context: {
          categoryid: parentid
        }
      })
    })
  })

  return Promise.all([productDetail, productList])
}

