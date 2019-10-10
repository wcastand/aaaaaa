import React from 'react'
import gql from 'graphql-tag'
import { useSubscription, useQuery } from '@apollo/react-hooks'

function App() {
  const { loading, data, error } = useSubscription(
    gql`
      subscription {
        info
      }
    `,
  )
  const q = useQuery(
    gql`
      {
        go
      }
    `,
  )
  console.log(q)
  console.log(loading, data, error)
  // if (loading) return 'loading'
  return <div>App {data ? Object.keys(data).join(',') : ''}</div>
}

export default App
