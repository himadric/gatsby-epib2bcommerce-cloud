/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  siteMetadata: {
    title: 'Epi B2B Commerce Cloud Storefront',
    description: 'This is a sample JAMStack implementation of Epi B2B Commerce Cloud.'
  },
  plugins: [
    {
      resolve: require.resolve(`../source-plugin-insite`),
      options: {
        insiteBaseUrl: 'https://nishtech.insitesandbox.com'
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
}
