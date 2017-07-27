/*@ngInject*/
//combine with ng-model-options={debounce:{'default':500,'blur':0}}
module.exports = function (REGEXP, $injector, $parse, $q, $timeout) {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      //get validRemote config
      var validRemote = scope.$eval(attrs.validRemote);
      //config remote api
      var validRemoteMethod = validRemote.method.split('.');
      var provider = validRemoteMethod[0];
      var method = validRemoteMethod[1];
      //valid function
      ctrl.$asyncValidators.validRemote = function (modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return $q.when();
        };

        //transform obj -- a.b.c => {a:{b:{c:xxx}}
        function getDeepObj(params, data) {
          var result = data;
          params.split('.').reverse().forEach(function (s) {
            var tmp = {};
            tmp[s] = result;
            result = tmp;
          });
          return result;
        }

        var def = $q.defer();
        //get injected service
        var service = $injector.get(provider);
        //set request
        var request = getDeepObj(validRemote.params, modelValue);
        //send remote api
        service[method](request).$promise.then(function (data) {
          if (validRemote.condition == 'array') {
            //if api return array
            if (data.length) {
              def.resolve();
              if (validRemote.callback) {
                scope.$eval(validRemote.callback)(data);
              }
            } else {
              def.reject();
            }
          } else {
            def.resolve();
            if (validRemote.callback) {
              scope.$eval(validRemote.callback)(data);
            }
          }
        }).catch(function (ex) {
          def.reject();
        });
        return def.promise;
      };
    }
  }
};

