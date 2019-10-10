import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { getMainDefinition } from 'apollo-utilities'

const GRAPHQL_ENDPOINT = 'ws://localhost:3031/graphql'
const wsClient = new SubscriptionClient(GRAPHQL_ENDPOINT, {
  reconnect: true,
  timeout: 60000,
})

const wsLink = new WebSocketLink(wsClient)
const httpLink = new HttpLink({ uri: 'http://localhost:3031/graphql' })

wsClient.maxConnectTimeGenerator.duration = () => wsClient.maxConnectTimeGenerator.max

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({ link, cache: new InMemoryCache(), connectToDevTools: true })

export default client
