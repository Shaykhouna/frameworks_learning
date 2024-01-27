import gql from 'graphql-tag'
import { apolloClient } from '@/vue-apollo'
import { LOGGED_IN_USER } from '@/graphql/queries'
import { LOGIN_USER, REGISTER_USER } from '@/graphql/mutations'

export const LOGGED_IN_USER = gql`
  query {
    me {
      id
      name
      email
    }
  }
`
