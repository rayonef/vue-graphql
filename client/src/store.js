import Vue from 'vue'
import Vuex from 'vuex'
import router from './router';

import { defaultClient as apolloClient } from '@/plugins/apollo';
import { 
  GET_POSTS,
  ADD_POST,
  SIGNIN_USER,
  SIGNUP_USER,
  GET_CURRENT_USER,
  SEARCH_POSTS,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  INFINITE_SCROLL_POSTS
} from './queries';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null,
    authError: null,
    searchResults: [],
    userPosts: []
  },
  mutations: {
    setPosts: (state, posts) => {
      state.posts = posts;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setLoading: (state, loading) => {
      state.loading = loading;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload) {
        state.searchResults = payload
      }
    },
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      apolloClient.query({
        query: GET_CURRENT_USER
      })
      .then(({ data }) => {
        // console.log(data.getCurrentUser)
        commit('setUser', data.getCurrentUser);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => { commit('setLoading', false); })
    },
    getPosts: ({ commit }) => {
      commit('setLoading', true);
      apolloClient
        .query({ query: GET_POSTS })
        .then(({ data }) => {
          commit('setPosts', data.getPosts);
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => { commit('setLoading', false); });
    },
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({ 
          query: GET_USER_POSTS,
          variables: { userId: payload }
        }).then(({ data }) => {
          console.log(data.getUserPosts);
          commit('setUserPosts', data.getUserPosts);
        }).catch(err => {
          console.log(err)
        })
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient.query({
        query: SEARCH_POSTS,
        variables: payload
      }).then(({ data }) => {
        commit('setSearchResults', data.searchPosts);
      }).catch(err => {
        console.log(err);
      });
    },
    addPost: ({ commit }, payload) => {
      commit('setLoading', true);
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // read query we want to upate
            const data = cache.readQuery({ query: GET_POSTS });
            // Create updated data
            data.getPosts.unshift(addPost);
            // Write updated data back to query
            cache.writeQuery({
              query: GET_POSTS,
              data
            });
          },
          // optimistic response ensures data is added inmediately as we specified for the update function
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              __typename: 'Post',
              _id: -1,
              ...payload
            }
          },
          // Return specified queries after perfoming the mutation in order to get fresh data
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pagenum: 1,
                pageSize:2
              }
            }
          ]
        })
        .then(({ data }) => {
          console.log(data.addPost);
          router.push('/');
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => { commit('setLoading', false) });
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient.mutate({
        mutation: UPDATE_USER_POST,
        variables: payload
      }).then(({ data }) => {
        const index = state.userPosts.findIndex(post => post._id === data.updateUserPost._id);
        const userPosts = [
          ...state.userPosts.slice(0, index),
          data.updateUserPost,
          ...state.userPosts.slice(index + 1)
        ];
        commit('setUserPosts', userPosts);
      }).catch(err => {
        console.log(err);
      })
    },
    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload
        }).then(({ data }) => {
          const index = state.userPosts.findIndex(post => post._id === data.deleteUserPost._id);
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ];
          commit('setUserPosts', userPosts);
        }).catch(err => {
          console.log(err);
        })
    },
    signinUser: ({ commit }, payload) => {
      commit('setError', null);

      localStorage.setItem('token', '');
      commit('setLoading', true);
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          // console.log(data.signinUser);
          localStorage.setItem('token', data.signinUser.token);
          router.go();
        })
        .catch(err => {
          commit('setError', err);
          console.error(err);
        })
        .finally(() => { commit('setLoading', false); });
    },
    signupUser: ({ commit }, payload) => {
      commit('setError', null);
      // console.log(payload);
      localStorage.setItem('token', '');
      commit('setLoading', true);
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          // console.log(data.signinUser);
          localStorage.setItem('token', data.signupUser.token);
          router.go();
        })
        .catch(err => {
          commit('setError', err);
          console.error(err);
        })
        .finally(() => { commit('setLoading', false); });
    },
    signoutUser: async ({ commit }) => {
      commit('setUser', null);
      localStorage.setItem('token', '');
      await apolloClient.resetStore();
      router.push('/');
    }
  },
  getters: {
    posts: state => state.posts,
    searchResults: state => state.searchResults,
    loading: state => state.loading,
    currentUser: state => state.user,
    error: state => state.error,
    authError: state => state.authError,
    userFavorites: state => state.user && state.user.favorites,
    userPosts: state => state.userPosts
  }
})
