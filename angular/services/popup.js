//造个轮子：https://github.com/dwmkerr/angular-modal-service/blob/master/src/angular-modal-service.js
import tpl_popup from '../templates/popup.html';
import '../../../assets/icons/close.png';

export default class {
  constructor($animate, $rootScope, $controller, $document, $compile, $q, $templateRequest, $timeout) {
    'ngInject';
    this.$animate = $animate;
    this.$document = $document;
    this.$compile = $compile;
    this.$q = $q;
    this.$templateRequest = $templateRequest;
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;
    this.$controller = $controller;
    this.modal = {};
  }

  getTemplate(template, templateUrl) {
    let deferred = this.$q.defer();
    if (template) {
      deferred.resolve(template);
    } else if (templateUrl) {
      this.$templateRequest(templateUrl, true)
        .then(template => {
          deferred.resolve(template);
        }, error => {
          deferred.reject(template);
        });
    } else {
      deferred.reject('没找到模板页');
    }
    return deferred.promise;
  }

  appendToBody(element) {
    let body = angular.element(this.$document[0].body);
    let children = body.children();
    //https://docs.angularjs.org/api/ng/service/$animate
    return this.$animate.enter(element, body, children[children.length - 1],{
      addClass:'ng-enter'
    }).then(() => {
      this.$animate.addClass(element, 'ng-enter-active');
    });
  }

  showModal(options) {
    let deferred = this.$q.defer();
    this.getTemplate(options.template, options.templateUrl)
      .then(template => {
        let modalScope = (options.scope || this.$rootScope)
          .$new();
        let rootScopeOnClose = this.$rootScope.$on('$locationChangeSuccess', cleanUpClose);

        if (options.controller) {
          //https://github.com/angular/angular.js/blob/master/src/ng/controller.js
          this.$controller(options.controller, {
            $scope: modalScope
          }, false)
        }
        template = '<div class="modalDrop">' + template + '</div>';
        let modalElement = this.$compile(template)(modalScope);

        let cleanUpClose = () => {
          this.$animate.leave(modalElement)
            .then(() => {
              modalScope.$destroy();
              deferred = null;
              modalElement = null;
              modalScope = null;
            });
        };

        modalScope.$close = (result) => {
          this.$animate.leave(modalElement)
            .then(() => {
              deferred.resolve(result);
              modalScope.$destroy();
              deferred = null;
              modalElement = null;
              modalScope = null;
            });
        }

        modalScope.$dismiss = (result) => {
          this.$animate.leave(modalElement)
            .then(() => {
              deferred.reject(result);
              modalScope.$destroy();
              deferred = null;
              modalElement = null;
              modalScope = null;
            });
        }

        this.appendToBody(modalElement);
        rootScopeOnClose && rootScopeOnClose();
      });

    return deferred.promise;
  }

  showPopup({ popInfo, positive = '确定', negative = '取消', subInfo}) {
    return this.showModal({
      templateUrl: tpl_popup,
      controller: ($scope) => {
        'ngInject';
        $scope.popInfo = popInfo;
        $scope.positive = positive;
        $scope.negative = negative;
        $scope.subInfo = subInfo;
      }
    });
  }

};
