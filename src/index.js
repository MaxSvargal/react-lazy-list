import React, { Component, PropTypes } from 'react'

export default class LazyList extends Component {
  constructor(props) {
    super(props)
    this.scrollListener = this.scrollListener.bind(this)

    const { windowHeight, elementHeight, children } = props
    const computedWindowHeight = windowHeight || document && document.body.clientHeight
    const computedElementHeight = elementHeight
    const showNum = Math.round(computedWindowHeight / computedElementHeight)
    const visibleChildren = children.slice(0, showNum)

    this.state = {
      showNum,
      visibleChildren,
      scrolledNum: 0,
      topOffset: 0,
      bottomOffset: 0
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scrollListener)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListener)
  }

  componentWillReceiveProps(props) {
    const { scrolledNum, showNum } = this.state
    const { children } = this.props

    children.length !== props.children.length &&
      this.setState({ visibleChildren: props.children.slice(scrolledNum, scrolledNum + showNum + 1) })
  }

  shouldComponentUpdate(props, state) {
    return this.state.topOffset !== state.topOffset ||
      this.props.children.length !== props.children.length
  }

  scrollListener() {
    const { showNum } = this.state
    const {
      children, elementHeight, topScrollOffset,
      onLoad, windowHeight, bottomScrollOffset
    } = this.props

    const fullHeight = children.length * elementHeight
    const scrolled = (window && window.scrollY || 0) - topScrollOffset
    const scrolledNum = Math.round((scrolled > 0 ? scrolled : 0) / elementHeight) - 1

    const visibleChildren = children.slice(scrolledNum, scrolledNum + showNum + 1)
    const topOffset = scrolledNum * elementHeight
    const bottomOffset = fullHeight - (topOffset + (showNum * elementHeight))
    const breakPoint = fullHeight - windowHeight - bottomScrollOffset

    if (this.state.topOffset !== topOffset || this.state.bottomOffset !== bottomOffset) {
      this.setState({ topOffset, bottomOffset, scrolledNum, visibleChildren })
      scrolled >= breakPoint && onLoad()
    }
  }

  render() {
    const { visibleChildren, topOffset, bottomOffset } = this.state
    return (
      <div>
        <div style={ { marginTop: topOffset } } />
        <div style={ { position: 'relative', width: '100%' } }>{ visibleChildren }</div>
        <div style={ { marginBottom: bottomOffset } } />
      </div>
    )
  }
}

LazyList.propTypes = {
  children: PropTypes.array.isRequired,
  elementHeight: PropTypes.number.isRequired,
  windowHeight: PropTypes.number,
  topScrollOffset: PropTypes.number,
  bottomScrollOffset: PropTypes.number,
  onLoad: PropTypes.func
}

LazyList.defaultProps = {
  topScrollOffset: 0,
  bottomScrollOffset: 0
}
