import React, { useEffect, useCallback, useState } from 'react'
import gql from 'graphql-tag'
import { useSubscription, useQuery } from '@apollo/react-hooks'

const SID = '1234567890'

function App() {
  const [photos, setPhotos] = useState([])
  const [isReady, setReady] = useState(false)
  const { loading, data, error } = useSubscription(
    gql`
      subscription createsub($sid: ID!) {
        createsub(sid: $sid) {
          ... on Photo {
            id
            title
          }
          ... on SubReady {
            subscribed
          }
        }
      }
    `,
    {
      variables: { sid: SID },
      shouldResubscribe: true,
      onSubscriptionData: async ({
        subscriptionData: {
          data: { createsub },
        },
      }) => {
        if (createsub.subscribed) setReady(createsub.subscribed)
        else setPhotos([...photos, createsub])
      },
    },
  )
  const { refetch } = useQuery(
    gql`
      query photos($sid: ID!, $limit: Int, $offset: Int) {
        photos(sid: $sid, limit: $limit, offset: $offset)
      }
    `,
    { variables: { sid: SID }, skip: true },
  )

  useEffect(() => {
    if (isReady) refetch()
  }, [refetch, isReady])

  const doit = () => refetch()
  return (
    <>
      <button onClick={doit}>Refetch</button>
      <ul>
        {photos.map(photo => (
          <li key={photo.id}>{photo.title}</li>
        ))}
      </ul>
    </>
  )
}

export default App
