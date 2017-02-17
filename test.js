const React = require('react')
const { shallow, mount } = require('enzyme')
const ReactTestUtils = require('react-addons-test-utils')
const LazyList = require('./index')

describe('LazyList', () => {
  let lazyListElement
  const children = [...Array(4)].map((v, key) => React.createElement('li', { key }))
  const props = { elementHeight: 100, windowHeight: 250, onLoad: jest.fn() }

  beforeEach(() => {
    lazyListElement = React.createElement(LazyList, props, children)
  })

  test('should render initial number of visible children', () => {
    const wrapper = shallow(lazyListElement)
    expect(wrapper.find('li').length).toBe(3)
  })

  test('should render without windowHeight', () => {
    Object.defineProperty(document.body, 'clientHeight', { value: 300 })
    lazyListElement = React.createElement(LazyList, { elementHeight: 100 }, children)
    const wrapper = mount(lazyListElement)
    expect(wrapper.find('li').length).toBe(3)
  })

  test('should rerender when pass a new children', () => {
    const wrapper = shallow(lazyListElement)
    expect(wrapper.find('li').length).toBe(3)

    wrapper.setProps({
      elementHeight: 100,
      children: Array.prototype.concat(children, React.createElement('li', { key: 4 }))
    })
    wrapper.render()
    expect(wrapper.find('li').length).toBe(4)
  })

  test('should show next entities on window scroll and call onLoad callback', () => {
    window.addEventListener = function(event, handler) {
      window.scrollY = 150
      handler()
    }
    const wrapper = mount(lazyListElement)
    const els = wrapper.find('li')

    expect(els.length).toBe(3)
    expect(els.at(0).key()).toBe('1')
    expect(els.at(1).key()).toBe('2')
    expect(els.at(2).key()).toBe('3')
    expect(props.onLoad.mock.calls.length).toBe(1)
  })

  test('should unsubscribe from scroll listener on unmount', () => {
    window.removeEventListener = jest.fn()
    const mockCalls = window.removeEventListener.mock.calls
    const wrapper = mount(lazyListElement)

    expect(mockCalls.length).toBe(0)
    wrapper.unmount()
    expect(mockCalls.length).toBe(1)
  })
})
