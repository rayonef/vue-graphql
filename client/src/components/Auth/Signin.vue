<template>
  <v-container text-xs-center mt-5 pt-5>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Welcome Back</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 class="mt-3">
        <v-card color="secondary" dark>
          <v-container grid-list-lg>
            <v-form @submit.prevent="submit">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    prepend-icon="face"
                    v-model="username"
                    label="Username"
                    type="text"
                    required />
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    prepend-icon="extension"
                    v-model="password"
                    label="Password"
                    type="password"
                    required />
                </v-flex>
                <v-flex xs12>
                  <v-btn 
                    color="accent" 
                    type="submit"
                    :loading="loading"
                    :disabled="loading">Signin</v-btn>
                  <h3>
                    Dont't have an account?
                    <router-link to="/signup">Signup</router-link>
                  </h3>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Signin',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  computed: {
    ...mapGetters(['loading', 'currentUser'])
  },
  watch: {
    currentUser(val) {
      if (val) {
        this.$router.push('/');
      }
    }
  },
  methods: {
    submit() {
      this.$store.dispatch('signinUser', {
        username: this.username,
        password: this.password
      })
    }
  }
}
</script>

