(function (){
  'use strict';

  angular.module("app")
  .component('post', {
    controller: controller,
  templateUrl: 'post/post.template.html'
  });

  controller.$inject = ["$http", "$state"];

  function controller($http, $state){
      const vm = this;
      vm.$onInit = function () {
      vm.showForm = false;
      vm.showPostEdit = 0;
      vm.showCommentEdit = 0;
      $http.get('/api/posts')
        .then( res => {
          vm.posts = res.data;
      });
      vm.order = '-vote_count';
      vm.orderType = 'Votes';
    };

      vm.createPost = function (){
        vm.postObj = vm.post;
        if(!vm.postObj.image_url){
          vm.postObj.image_url = 'https://lh3.googleusercontent.com/LpRhadZPA_VaJBjqIsXC-thVKWm57PLjOblI9UllEULPoJZgZQPFK0xHfTMa8Nspmg=w300';
        }
        vm.postObj.showComments = false;
        vm.postObj.vote_count = 0;
        $http.post('api/posts', vm.postObj)
        .then(res=>{
          vm.posts.push(res.data);
        });
        delete vm.post;
      };

      vm.createComment = function (postId, postIndex){
        let commentBody = {
          content: vm.content,
          post_id: postId,
        };

        $http.post(`api/posts/${postId}/comments`, commentBody)
          .then(res=>{
            if(!vm.posts[postIndex].comments){
              vm.posts[postIndex].comments = [];
            }
            vm.posts[postIndex].comments.push(commentBody);
            delete vm.content;
          });
      };

      vm.upVote = function(postId, postIndex){
        $http.post(`api/posts/${postId}/votes`)
          .then (res=>{
            vm.posts[postIndex].vote_count +=1;
          });
      };

      vm.downVote = function(postId, postIndex){
        if (vm.posts[postIndex].vote_count > 0){
          $http.delete(`api/posts/${postId}/votes`)
            .then(res=>{
              vm.posts[postIndex].vote_count -=1;
            });
          }
      };

      vm.changeShowCommentEdit = function(postId){
        if (vm.showCommentEdit === 0){
          vm.showCommentEdit = postId;
        } else if (vm.showCommentEdit === postId){
          vm.showCommentEdit = 0;
        } else {
          vm.showCommentEdit = postId;
        }
      };

      vm.sortBy = function(value, display){
        vm.order = value;
        vm.orderType = display;
      };
    }//closes controller function

}());
