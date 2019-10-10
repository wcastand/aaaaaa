const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')

const typeDefs = [
  `
  type Photo {
    albumId: ID
    id: ID
    title: String
    url: String
    thumbnailUrl: String
  }
  type SubReady {
    subscribed: Boolean
  }
  union SubResponse = SubReady | Photo

  type Query {
    photos(sid: ID!, limit: Int, offset: Int): Boolean!
    operatesub(sid: ID!, operation: String!): Boolean!
  }
  type Subscription {
    createsub(sid: ID!): SubResponse!
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
