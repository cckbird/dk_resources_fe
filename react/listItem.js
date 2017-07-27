import React from 'react';
import update from 'immutability-helper';

// 给正常组件加个套，所有Props上的方法，调用时会把props上的index放在参数最后一位调用
function listItem(WrappedComponent) {
  // 需要自带index属性
  return class extends React.Component {
    constructor() {
      super();
      // 绑定套过的方法和原值属性
      this.state = {};
    }

    componentWillMount() {
      const bindedFunction = {};
      // const keys = Reflect.ownKeys(this.props);
      const keys = Object.keys(this.props);
      keys.forEach((key) => {
        if (typeof this.props[key] === 'function') {
          bindedFunction[key] = (...data) => {
            // 绑定原组件方法，末尾加上当前index参数
            // 原方法需要绑定所在控件的this
            this.props[key](...data, this.props.index);
          }
        }
      });

      this.setState(update(this.state, {
        $set: Object.assign({...this.props}, bindedFunction),
      }));
    }

    render() {
      return <WrappedComponent {...this.state} />;
    }
  }
}

export default listItem;
