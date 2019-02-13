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
    <v-toolbar color="primary" dark style="z-index: 8;">
      <v-toolbar-side-icon @click="sideNav = !sideNav" />
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">
          Vue Share
        </router-link>
      </v-toolbar-title>

      <v-spacer />

      <v-text-field 
        v-model="searchTerm"
        @input="handleSearchPosts"
        flex 
        prepend-icon="search"
        placeholder="Search post"
        color="accent"
        single-line
        hide-details />

        <v-card dark v-if="searchResults.length" id="search__card">
          <v-list>
            <v-list-tile @click="goToSearchResult(result._id)" v-for="result in searchResults" :key="result._id">
              <v-list-tile-title>
                {{ result.title }} - 
                <span class="font-weight-thin">{{ formatDescription(result.description) }}</span>
              </v-list-tile-title>

              <v-list-tile-action v-if="checkIfUserFavorite(result._id)">
                <v-icon>favorite</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>

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
            <v-badge right color="blue darken-2" :class="{ 'bounce': badgeAnimated }">
              <span slot="badge" v-if="userFavorites.length">{{ userFavorites.length }}</span>
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
      authErrorSnackbar: false,
      badgeAnimated: false,
      searchTerm: ''
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'authError', 'userFavorites', 'searchResults']),
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
    },
    userFavorites(val) {
      if (val) {
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false), 1000);
      }
    }
  },
  methods: {
    signout() {
      this.$store.dispatch('signoutUser')
    },
    goToSearchResult(resultId) {
      this.searchTerm = '';
      this.$router.push(`/posts/${resultId}`);
      this.$store.commit('setSearchResults', []);
    },
    formatDescription(desc) {
      return desc.length < 30 ? `${desc.slice(0, 30)}...` : desc;
    },
    checkIfUserFavorite(resultId) {
      return this.userFavorites && this.userFavorites.some(fave => fave._id === resultId);
    },
    handleSearchPosts() {
      this.$store.dispatch('searchPosts', {
        searchTerm: this.searchTerm
      });
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

#search__card {
  position: absolute;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%;
}

.bounce {
  animation: bounce 1s both;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }

  40%, 43% {
    transform: translate3d(0, -20px, 0);
  }

  70% {
    transform: translate3d(0, -10px, 0);
  }

  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>

