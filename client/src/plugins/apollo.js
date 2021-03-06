import Vue from 'vue';
import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';
import store from '../store';

Vue.use(VueApollo);

export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  // auth token
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('token', '');
    };
    // console.log('token', token);
    operation.setContext({
      headers: {
        authorization: token
      }
    })
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log('network Error', networkError);
    }
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.name === 'AuthenticationError') {
          store.commit('setAuthError', err);
          store.dispatch('signoutUser');
        }
      }
    }
  }
});

export const apolloProvider = new VueApollo({ defaultClient });