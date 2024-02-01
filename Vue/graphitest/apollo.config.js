// apollo.config.js
module.exports = {
    client: {
      service: {
        name: 'graphitest',
        // URL to the GraphQL API
        url: 'https://localhost:8080/graphql',
      },
      // Files processed by the extension
      includes: [
        'src/**/*.vue',
        'src/**/*.js',
      ],
    },
  }