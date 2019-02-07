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
          v-for="(item, i) in navItems" 
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
        </v-toolbar-items>
    </v-toolbar>
    <main>
      <transition name="fade">
        <router-view />
      </transition>
    </main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      sideNav: false
    }
  },
  computed: {
    navItems() {
      return [
        { icon: 'chat', title: 'Posts', link: '/posts' },
        { icon: 'lock_open', title: 'Sign In', link: '/signin' },
        { icon: 'create', title: 'Sign Up', link: '/signup' }
      ]
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

