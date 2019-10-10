import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

function App() {
  // const { loading, data, error } = useSubscription(
  //   gql`
  //     subscription {
  //       info
  //     }
  //   `,
  //   { onSubscriptionData: (...d) => console.log(d) },
  // )
  const { loading, data, error } = useQuery(
    gql`
      {
        go
      }
    `,
  )
  console.log(loading, data, error)
  return <div>App</div>
}

export default App
