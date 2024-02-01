import router from '../../router/index.js'
import store from '../index.js';

const state = {
  token: localStorage.getItem('jwtoken') || null,
  isAuthenticated: sessionChecker(localStorage.getItem('jwtoken')),
  user: null,
};

const mutations = {
  setToken(state, token) {
    state.token = token;
    state.isAuthenticated = !!token;
    localStorage.setItem('jwtoken', token);
  },
  setUser(state, user) {
    state.user = user;
  },
};

const actions = {
  async login({ commit }, { username, password, credentials }) {
    const store = require('../index').default;
    try {
      // Send authentication request to GraphQL server
      const response = await fetch('https://learn.zone01dakar.sn/api/auth/signin', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`, // Include Basic authentication header
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });


      if (response.status != 200) {
        response['error'] = 'Failed to authenticate user'
        return response
      } else {
        if (!response.ok) {
          response['error'] = 'Failed to authenticate user'
          return response
          // throw new Error('Failed to authenticate user');
        }

        // Extract the JWT token from the response
        const token = await response.json();
        commit('setToken', token);
        return response;
      }
    } catch (error) {
      console.error('Error:', error);
      return {"error": 'Failed to authenticate user'}
      // throw error;
    }
  },
  async logout({ commit }) {
    commit('setToken', null);
    commit('setUser', null);
    localStorage.clear()
  },
  // routerSateChecking({ commit }) {
  //   // Perform mutations or any other logic needed before route navigation
  //   // For example:
  //   commit('mutationName', payload);
  // },
};

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  currentUser: state => state.user,
};

function sessionChecker(token) {
  const graphqlQuery = ` query { user { id } }`;

  fetch('https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query: graphqlQuery })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    })
    .then(data => {
      if (data.errors) {
        return false;
      } else {
        return true;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      return false;
    });
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
