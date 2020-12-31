const { ApolloClient } = require("apollo-client")
const { InMemoryCache } = require("apollo-cache-inmemory")
const { split } = require("apollo-link")
const { HttpLink } = require("apollo-link-http")
const { WebSocketLink } = require("apollo-link-ws")
const { getMainDefinition } = require("apollo-utilities")
const fetch = require("node-fetch")
const gql = require("graphql-tag")
const WebSocket = require("ws")
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

//exports.onPreInit = () => console.log("Loaded source-plugin-insite")

// constants for your GraphQL Post and Author types
const CATEGORY_NODE_TYPE = `Category`
const PRODUCT_NODE_TYPE = `Product`

const client = new ApolloClient({
    link: split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        )
      },
      new WebSocketLink({
        uri: `ws://localhost:4000`, // or `ws://gatsby-source-plugin-api.glitch.me/`
        options: {
          reconnect: true,
        },
        webSocketImpl: WebSocket,
      }),
      new HttpLink({
        uri: "http://localhost:4000", // or `https://gatsby-source-plugin-api.glitch.me/`
        fetch,
      })
    ),
    cache: new InMemoryCache(),
  })

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
  getNodesByType,
}) => {
  const { createNode } = actions
    const { data } = await client.query({
        query: gql`
        query {
            categoryCollection(maxdepth:4) {
              uri
              categories {
                uri
                id
                shortDescription
                urlSegment
                smallImagePath
                largeImagePath
                imageAltText
                subCategories {
                  uri
                  id
                  shortDescription
                  urlSegment
                  smallImagePath
                  largeImagePath
                  imageAltText
                  subCategories {
                    uri
                    id
                    shortDescription
                    urlSegment
                    smallImagePath
                    largeImagePath
                    imageAltText
                  }
                }
              }
            }
          }
        `,
    })

  // loop through data and create Gatsby nodes
//   data.categoryCollection.categories.forEach(category => 
//     createNode({
//       ...category,
//       id: createNodeId(`${CATEGORY_NODE_TYPE}-${category.id}`),
//       parent: null,
//       children: [],
//       internal: {
//         type: CATEGORY_NODE_TYPE,
//         content: JSON.stringify(category),
//         contentDigest: createContentDigest(category),
//       },
//     })
//)
    createCategoryNodeRecurse(data.categoryCollection.categories, null,
        createNode,
        createContentDigest,
        createNodeId,
        getNodesByType,
      )
  return
}

function createCategoryNodeRecurse(categories, parentNodeId,
    createNode,
    createContentDigest,
    createNodeId,
    getNodesByType,
  ) {
    if(categories)
    {
        categories.forEach(category => {
            const nodeId = createNodeId(`${CATEGORY_NODE_TYPE}-${category.id}`)
            createNode({
                ...category,
                id: nodeId,
                parent: parentNodeId,
                children: [],
                internal: {
                  type: CATEGORY_NODE_TYPE,
                  content: JSON.stringify(category),
                  contentDigest: createContentDigest(category),
                },
              })

              // Create poduct nodes
              createProductNodeByCategory(category.id, nodeId, createNode,
                createContentDigest,
                createNodeId,
                getNodesByType )
              createCategoryNodeRecurse(category.subCategories, nodeId, createNode,
                createContentDigest,
                createNodeId,
                getNodesByType,)              
            })
    }
}

const createProductNodeByCategory = async (categoryId, parentNodeId, createNode,
  createContentDigest,
  createNodeId,
  getNodesByType ) => {
    const { data } = await client.query({
      query: gql`
      query {
        productCollection(categoryId:"${categoryId}", pagesize: 100) {
          uri
          pagination {
            currentPage
            page
            pageSize
            defaultPageSize
            totalItemCount
            numberOfPages
            sortType
            nextPageUri
            prevPageUri
          }
          products {
            id
            erpNumber
            manufacturerItem
            mediumImagePath
            shortDescription
            unitOfMeasureDisplay
            productDetailUrl
            attributeTypes {
              name
              label
              attributeValues {
                value
              }
            }
            pricing {
              actualPriceDisplay
            }
          }
        }
      }
      `,
  })
  data.productCollection.products.forEach(product => {
    createNode({
        ...product,
        id: createNodeId(`${PRODUCT_NODE_TYPE}-${product.id}`),
        parent: parentNodeId,
        children: [],
        internal: {
          type: PRODUCT_NODE_TYPE,
          content: JSON.stringify(product),
          contentDigest: createContentDigest(product),
        },
      })
    })
}

// called each time a node is created
exports.onCreateNode = async ({
    node, // the node that was just created
    actions: { createNode },
    createNodeId,
    getCache,
  }, pluginOptions) => {
    if (node.internal.type === CATEGORY_NODE_TYPE) {
        if(node.largeImagePath)
        {
            console.log(`Image Path: ${pluginOptions.insiteBaseUrl}${node.largeImagePath}`)
            const fileNode = await createRemoteFileNode({
                // the url of the remote image to generate a node for
                url: `${pluginOptions.insiteBaseUrl}${node.largeImagePath}`,
                parentNodeId: node.id,
                createNode,
                createNodeId,
                getCache,
              })
              if (fileNode) {
                node.remoteImage = fileNode.id
              }
        }
    }
    if (node.internal.type === PRODUCT_NODE_TYPE) {
      if(node.mediumImagePath)
      {
          console.log(`Image Path: ${node.mediumImagePath}`)
          const fileNode = await createRemoteFileNode({
              // the url of the remote image to generate a node for
              url: `${node.mediumImagePath}`,
              parentNodeId: node.id,
              createNode,
              createNodeId,
              getCache,
            })
            if (fileNode) {
              node.remoteImage = fileNode.id
            }
      }
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  console.log('Inside createSchemaCustomization')
  const { createTypes } = actions
  createTypes(`
    type Category implements Node {
      uri: String!
      id: ID!
      shortDescription: String!
      urlSegment: String!
      smallImagePath: String
      largeImagePath: String
      imageAltText: String
      # create relationships between Category and File nodes for optimized images
      remoteImage: File @link
      # create relationships between Category and Category nodes
      category: Category @link(from: "parent" by: "id")
    }
    type Product implements Node {
      id: ID!
      categoryPath: String
      erpNumber: String
      manufacturerItem: String
      mediumImagePath: String
      shortDescription: String
      unitOfMeasureDisplay: String
      productDetailUrl: String
      attributeTypes: [AttributeType]
      pricing: Pricing 
      # create relationships between Product and File nodes for optimized images
      remoteImage: File @link
      # create relationships between Product and Category nodes
      category: Category @link(from: "parent" by: "id")
    }
    type Pricing {
      actualPriceDisplay: String
    }
    type AttributeType {
      name: String
      label: String
      attributeValues: [AttributeValue] 
    }
    type AttributeValue {
      value: String
    }`)
}