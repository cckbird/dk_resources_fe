import React from 'react';
import './style.scss';

class SHOW extends React.Component {
  constructor() {
    super();
    this.state = { cachedHtml: '' };
  }

  componentWillUpdate(nextProps) {
    if (nextProps.show && !this.state.cachedHtml) {
      this.setState({ cachedHtml: this.props.children });
    }
  }

  componentWillMount() {
    if (this.props.show && !this.state.cachedHtml) {
      this.setState({ cachedHtml: this.props.children });
    }
  }

  render() {
    return (
      <div
        className={this.props.show ? 'show' : 'hide'}
      >
        {this.state.cachedHtml}
      </div>
    );
  }

}

export default SHOW;
