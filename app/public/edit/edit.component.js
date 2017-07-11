(function (){
  'use strict';

  angular.module("app")
  .component('edit', {
    controller: controller,
  templateUrl: 'edit/edit.template.html'
  });

  controller.$inject = ["$http", "$state", "$stateParams"];

  function controller($http, $state, $stateParams){
      const vm = this;
      vm.$onInit = function () {
        $http.get(`api/posts/${$stateParams.id}`)
          .then (res=>{
            vm.post = res.data
          });
    };

      vm.updatePost = function (){
        let revisedPost = {};
        Object.assign(revisedPost, vm.post, vm.edit);
        $http.patch(`api/posts/${$stateParams.id}`, revisedPost)
          .then(res=>{
            $state.go('home');
          });
      };

    }//closes controller function

}());
