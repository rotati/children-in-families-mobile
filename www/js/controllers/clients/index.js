(function() {
  'use strict';

  angular
    .module('cif')
    .controller('ClientIndexCtrl', ClientIndexCtrl)

  ClientIndexCtrl.$inject = ['Client', '$rootScope', '$scope', '$translate'];

  function ClientIndexCtrl(Client, $rootScope, $scope, $translate) {
    var vm             = this,
        paginateOption = {limit: 40, page: 0};

    vm.search      = '';
    vm.clients     = [];
    vm.isLoadMore  = true;
    vm.title       = 'Chantra';
    vm.currentDate = new Date().toLocaleDateString();
    vm.refresh     = _refresh;
    vm.loadMore    = _loadMore;

    init();

    function init() {
      $rootScope.$broadcast('loading:show');

      loadClient();
    }

    function loadClient() {
      Client.all(paginateOption).then(function(response) {
        vm.clients = response;

        $rootScope.$broadcast('loading:hide');
        $scope.$broadcast('scroll.refreshComplete');
      }).catch(function(error) {
        console.log(error);
      })
    }

    function _refresh() {
      init();
    }

    function _loadMore() {
      paginateOption.page = paginateOption.page + 1;
      loadClient();
    }
  }
})()
