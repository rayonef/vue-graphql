import Vue from 'vue'
import Vuex from 'vuex'
import router from './router';

import { defaultClient as apolloClient } from '@/plugins/apollo';
import { GET_POSTS, SIGNIN_USER, GET_CURRENT_USER } from './queries';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false
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
    signinUser: ({ commit }, payload) => {
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
    loading: state => state.loading,
    currentUser: state => state.user
  }
})
