const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')

const typeDefs = [
  `
  type Query {
    go: String!
  }
  type Subscription {
    info: String!
  }
`,
]

const options = {
  typeDefs,
  resolvers,
}

const executableSchema = makeExecutableSchema(options)
module.exports = executableSchema
module.exports.typeDefs = typeDefs
