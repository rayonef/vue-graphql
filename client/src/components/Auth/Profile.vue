<template>
  <v-container class="text-xs-center">
    <v-flex sm6 offset-sm3>
      <v-card class="white-text" color="secondary">
        <v-layout>
          <v-flex xs5>
            <v-img heigth="125px" :src="currentUser.avatar" />
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{ currentUser.username }}</div>
                <div>Joined {{ currentUser.joinDate|prettyDate }}</div>
                <div class="hidden-xs-only font-weight-thin">{{ currentUser.favorites.length }} Favorites</div>
                <div class="hidden-xs-only font-weight-thin">{{ userPosts.length }} Posts Added</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!-- USER FAVORITES -->

    <v-container v-if="!userFavorites.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You have no favorites currently. Go and add some</h2>
        </v-flex>
      </v-layout>
    </v-container>
    
    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">Favorited 
          <span class="font-weight-regular">{{ userFavorites.length }}</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img @click="goToPost(favorite._id)" heigth="30vh" :src="favorite.imageUrl"></v-img>
            <v-card-text>{{ favorite.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- USER POSTS -->

    <v-container v-if="!userPosts.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You haver no posts currently. Go and add some</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="mt-3">
      <v-flex xs12>
        <h2 class="font-weight-light">Your posts
          <span class="font-weigth-regular">{{ userPosts.length }}</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-btn @click="loadPost(post)" color="info" floating fab small dark>
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn @click="handleDeleteUserPost(post)" color="error" floating fab small dark>
              <v-icon>delete</v-icon>
            </v-btn>

            <v-img @click="goToPost(post._id)" height="30vh" :src="post.imageUrl"></v-img>
            <v-card-text>{{ post.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Edit Post Dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="editPostDialog">
      <v-card>
        <v-form 
          ref="form" 
          v-model="isFormValid"
          lazy-validation
          @submit.prevent="submit"
        >
          <v-card-title class="headline grey lighten-2">Update Post</v-card-title>
          <v-container grid-list-lg>
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

            </v-layout>
          </v-container>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              color="success" 
              type="submit"
              flat
              :loading="loading"
              :disabled="loading || !isFormValid">Update</v-btn>
            <v-btn flat color="error" @click="editPostDialog = false">Cancel</v-btn>
          </v-card-actions>
         </v-form>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Profile',
  data() {
    return {
      editPostDialog: false,
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
  computed: {
    ...mapGetters(['currentUser', 'userFavorites', 'userPosts', 'loading'])
  },
  created() {
    this.handleGetUserPosts();
  },
  methods: {
    goToPost(id) {
      this.$router.push(`/posts/${id}`);
    },
    handleGetUserPosts() {
      this.$store.dispatch('getUserPosts', this.currentUser._id);
    },
    handleDeleteUserPost(post) {
      this.loadPost(post, false);
      const deletePost = window.confirm('Are you sure you want to delete this post?');
      if (deletePost) {
        this.$store.dispatch('deleteUserPost', { postId: this.postId });
      }
    },
    loadPost({ _id, title, imageUrl, categories, description}, editPostDialog = true) {
      this.editPostDialog = editPostDialog;
      this.postId = _id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.categories = categories;
      this.description = description;
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('updateUserPost', {
          postId: this.postId,
          userId: this.currentUser._id,
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description
        });
        this.editPostDialog = false;
      }
    }
  },
}
</script>

