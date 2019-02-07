import Vue from 'vue'
import Vuex from 'vuex'

import { defaultClient as apolloClient } from '@/plugins/apollo';
import { GET_POSTS, SIGNIN_USER, GET_CURRENT_USER } from './queries';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false
  },
  mutations: {
    setPosts: (state, posts) => {
      state.posts = posts;
    },
    setLoading: (state, loading) => {
      state.loading = loading;
    },
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      apolloClient.query({
        query: GET_CURRENT_USER
      })
      .then(({ data }) => {
        console.log(data.getCurrentUser)
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
    signinUser: ({ commit }, payload) => {
      commit('setLoading', true);
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          // console.log(data.signinUser);
          localStorage.setItem('token', data.signinUser.token);
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => { commit('setLoading', false); });
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading
  }
})
