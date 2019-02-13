<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap v-if="infiniteScrollPosts">
      <v-flex xs12 sm6 v-for="post in infiniteScrollPosts.posts" :key="post._id">
        <v-card hover>
          <v-img @click.native="goToPost(post._id)" :src="post.imageUrl" height="30vh" lazy />
          <v-card-actions>
            <v-card-title primary>
              <div>
                <div clas="headline">{{ post.title }}</div>
                <span class="grey--text">{{ post.likes }} likes - {{ post.messages.length }} comments</span>
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="showPostCreator = !showPostCreator">
              <v-icon>{{ `keyboard_arrow_${showPostCreator ? 'up' : 'down' }` }}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-slide-y-transition>
            <v-card class="grey lighten-4" v-if="showPostCreator">
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="post.createdBy.avatar" alt="">
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title class="text--primary">{{ post.createdBy.username }}</v-list-tile-title>
                  <v-list-tile-sub-title class="font-weigth-thin">
                    Added {{ post.createdDate|prettyDate }}
                  </v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">info</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-card>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout column v-if="showMoreEnabled">
      <v-flex xs12>
        <v-layout justify-center row>
          <v-btn @click="showMorePosts" color="info">Fetch More</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { INFINITE_SCROLL_POSTS } from '../../queries';

const pageSize = 2;

export default {
  name: 'Posts',
  data() {
    return {
      pageNum: 1,
      showPostCreator: false
    }
  },
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize
      }
    }
  },
  computed: {
    showMoreEnabled() {
      return this.infiniteScrollPosts && this.infiniteScrollPosts.hasMore
    }
  },
  methods: {
    formatCreatedDate(date) {
      return moment(new Date(date)).format('ll');
    },
    showMorePosts() {
      this.pageNum += 1;
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          pageNum: this.pageNum,
          pageSize
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;

          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              posts: [
                ...prevResult.infiniteScrollPosts.posts,
                ...newPosts
              ],
              hasMore
            }
          }
        }
      });
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    }
  }
}
</script>

