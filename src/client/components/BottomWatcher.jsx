import React from 'react';
import _ from 'lodash';

export class BottomWatcher extends React.Component {
  constructor(props) {
    super(props);
    this.handleScrollOrResize = _.debounce(this.handleScrollOrResize.bind(this), 100);
    this.isElementVisible = this.isElementVisible.bind(this);
  }

  handleScrollOrResize() {
    if (this.isElementVisible()) {
      this.props.onBottomReached();
    }
  }

  isElementVisible() {
    const elem = this.refs.watcher;
    const elemTop = elem.getBoundingClientRect().top;
    return elemTop < window.innerHeight;
  }

  componentWillMount() {
    window.addEventListener('scroll', this.handleScrollOrResize);
    window.addEventListener('resize', this.handleScrollOrResize);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScrollOrResize);
    window.removeEventListener('resize', this.handleScrollOrResize);
  }

  render() {
    return <div ref="watcher"></div>;
  }
}

BottomWatcher.propTypes = {
  onBottomReached: React.PropTypes.func.isRequired,
};
