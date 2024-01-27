// apollo.config.js
module.exports = {
    client: {
      service: {
        name: 'graphitest',
        // URL to the GraphQL API
        url: 'https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql',
      },
      // Files processed by the extension
      includes: [
        'src/**/*.vue',
        'src/**/*.js',
      ],
    },
  }