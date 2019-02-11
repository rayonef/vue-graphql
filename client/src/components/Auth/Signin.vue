<template>
  <v-container text-xs-center mt-5 pt-5>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3 class="mb-3">
        <h1>Welcome Back</h1>
      </v-flex>

      <!-- Error Alert -->
      <v-flex v-if="error" xs12 sm6 offset-sm3>
        <form-alert :message="error.message" />
      </v-flex>
 

      <v-flex xs12 sm6 offset-sm3>
        <v-card color="secondary" dark>
          <v-container grid-list-lg>
            <v-form 
              ref="form" 
              v-model="isFormValid"
              lazy-validation
              @submit.prevent="submit"
            >
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field
                    prepend-icon="face"
                    :rules="usernameRules"
                    v-model="username"
                    label="Username"
                    type="text"
                    required />
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    prepend-icon="extension"
                    v-model="password"
                    :rules="passwordRules"
                    label="Password"
                    type="password"
                    required />
                </v-flex>
                <v-flex xs12>
                  <v-btn 
                    color="accent" 
                    type="submit"
                    :loading="loading"
                    :disabled="loading || !isFormValid">Signin</v-btn>
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
      isFormValid: true,
      username: '',
      password: '',
      usernameRules: [
        username => !!username || 'Username is required',
        username => username.length < 10 || 'Username must be less than 10 chars.'
      ],
      passwordRules: [
        password => !!password || 'Password is required',
        password => password.length >= 6 || 'Password must be at least 6 chars.'
      ]
    }
  },
  computed: {
    ...mapGetters(['loading', 'currentUser', 'error'])
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
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signinUser', {
          username: this.username,
          password: this.password
        })
      }
    }
  }
}
</script>

