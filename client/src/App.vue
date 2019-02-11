<template>
  <v-app style="background: #E3E3EE">
    <!-- Nav drawer -->
    <v-navigation-drawer
      app
      temporary
      fixed
      v-model="sideNav"
    >
      <v-toolbar color="accent" dark flat>
        <v-toolbar-side-icon @click="sideNav = !sideNav" />
        <router-link to="/" tag="span" style="cursor: pointer">
         <h1 class="title pl-3">Vue Share</h1>
        </router-link>
      </v-toolbar>

      <v-divider />

      <v-list>
        <v-list-tile 
          ripple 
          v-for="(item, i) in sideNavItems" 
          :key="i" 
          :to="item.link"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{ item.title }}
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-if="currentUser" @click="signout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Signout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <!-- Toolbar -->
    <v-toolbar color="primary" dark>
      <v-toolbar-side-icon @click="sideNav = !sideNav" />
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">
          Vue Share
        </router-link>
      </v-toolbar-title>

      <v-spacer />

      <v-text-field 
        flex 
        prepend-icon="search"
        placeholder="Search post"
        color="accent"
        single-line
        hide-details />

        <v-spacer />

        <v-toolbar-items class="hidden-xs-only">
          <v-btn 
            flat 
            v-for="(item, i) in navItems"
            :key="i"
            :to="item.link"
          >
            <v-icon class="hidden-sm-only" left>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>

          <v-btn flat to="/profile" v-if="currentUser">
            <v-icon class="hidden-sm-only" left>account_box</v-icon>
            <v-badge right color="blue darken-2">
              <span slot="badge">1</span>
              Profile
            </v-badge>
          </v-btn>

          <v-btn flat v-if="currentUser" @click="signout">
            <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
            Signout
          </v-btn>
        </v-toolbar-items>
    </v-toolbar>
    <main>
      <transition name="fade">
        <router-view />
      </transition>

      <v-snackbar 
        color="success"
        bottom
        left
        :timeout="5000"
        v-model="authSnackbar"
      >
        <v-icon dark class="mr-3">check_circle</v-icon>
        <h3>You are now signed in!</h3>
        <v-btn dark flat @click="authSnackbar = false">Close</v-btn>
      </v-snackbar>

      <v-snackbar
        v-if="authError" 
        color="info"
        bottom
        left
        :timeout="5000"
        v-model="authErrorSnackbar"
      >
        <v-icon dark class="mr-3">cancel</v-icon>
        <h3>{{ authError.message }}</h3>
        <v-btn dark flat to="/signin">Signing</v-btn>
      </v-snackbar>
      
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false
    }
  },
  watch: {
    currentUser(newValue, oldValue) {
      if (!oldValue) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'authError']),
    navItems() {
      let items = [
        { icon: 'chat', title: 'Posts', link: '/posts' },
        { icon: 'lock_open', title: 'Sign In', link: '/signin' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ]
      if (this.currentUser) {
        items = [
          { icon: 'chat', title: 'Posts', link: '/posts' }
        ]
      }
      return items;
    },
    sideNavItems() {
      let items = [
        { icon: 'chat', title: 'Posts', link: '/posts' },
        { icon: 'lock_open', title: 'Sign In', link: '/signin' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ]
      if (this.currentUser) {
        items = [
          { icon: 'chat', title: 'Posts', link: '/posts' },
          { icon: 'stars', title: 'Create Post', link: '/post/add' },
          { icon: 'account_box', title: 'Profile', link: '/profile' }
        ]
      }
      return items;
    }
  },
  methods: {
    signout() {
      this.$store.dispatch('signoutUser')
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: all;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: translateY(-25px);
}
</style>

