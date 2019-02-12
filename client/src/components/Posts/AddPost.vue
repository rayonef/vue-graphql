<template>
    <v-container text-xs-center mt-5 pt-5>
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3 class="mb-3">
        <h1 class="primary--text">Add Post</h1>
      </v-flex>

      <v-flex xs12 sm6 offset-sm3>
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
                  :rules="titleRules"
                  v-model="title"
                  label="Post Title"
                  type="text"
                  required />
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  :rules="imageRules"
                  v-model="imageUrl"
                  label="Image URL"
                  type="text"
                  required />
              </v-flex>

              <v-flex xs12>
                <img :src="imageUrl" alt="" height="300px">
              </v-flex>

              <v-flex xs12>
                <v-select
                  v-model="categories"
                  :rules="categoriesRules"
                  :items="['Art', 'Education', 'Travel', 'Photograpy', 'Technology']"
                  multiple
                  label="categories" />
              </v-flex>

              <v-flex xs12>
                <v-textarea
                  :rules="descRules"
                  v-model="description"
                  label="Post Description"
                  type="text"/>
              </v-flex>

              <v-flex xs12>
                <v-btn 
                  color="info" 
                  type="submit"
                  :loading="loading"
                  :disabled="loading || !isFormValid">Submit</v-btn>
                
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'AddPost',
  data() {
    return {
      isFormValid: true,
      title: '',
      imageUrl: '',
      categories: [],
      description: '',
      titleRules: [
        title => !!title || 'Title is required',
        title => title.length < 20 || 'Title must be less than 20 chars.'
      ],
      imageRules: [
        image => !!image || 'Image is required'
      ],
      categoriesRules: [
        categories => categories.length >= 1 || 'At least one category is required'
      ],
      descRules : [
        description => !!description || 'Description is required',
        description => description.length < 200 || 'Description must be less than 200 chars.'

      ]
    }
  },
  computed: { ...mapGetters(['loading', 'currentUser']) },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('addPost', {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.currentUser._id
        })
      }
    }
  }
}
</script>

