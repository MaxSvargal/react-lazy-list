# react-lazy-list

[![Build Status](https://travis-ci.org/MaxSvargal/react-lazy-list.svg?branch=master)](https://travis-ci.org/MaxSvargal/react-lazy-list)
[![Coverage Status](https://coveralls.io/repos/github/MaxSvargal/react-lazy-list/badge.svg?branch=master)](https://coveralls.io/github/MaxSvargal/react-lazy-list?branch=master)
[![Dependencies Status](https://david-dm.org/MaxSvargal/react-lazy-list.svg)](https://david-dm.org/MaxSvargal/react-lazy-list)

This is a simple and fast realization of lazy list as the react component that show entities only when user can see them. Thats why it can render very large lists and does not lose performance.

```javascript
import React, { Component } from 'react'
import LazyList from 'react-lazy-list'

export default class App extends Component {
  render() {
    const onMoreHandle = () => void
    return (
      <LazyList elementHeight={ 300 } onMore={ this.onMoreHandle } >
        { entities.map(entity => (
          <Item key={ entity.id } entity={ entity } />
        )) }
        <Dummy />
      </LazyList>
    )
  }
}
```

## props

### `children`
`Object` **required** Entities collection to render.

### `elementHeight`
`Number` **required** Pixels number of height of collection entity.

### `windowHeight`
`Number` Custom container height in pixels, i.e. for server side rendering.

### `topScrollOffset`
`Number` Offset from top of window to increase the threshold of the moment trip.
Usable to make a scroll offset for header height.

### `bottomScrollOffset`
`Number` Offset from top of window to decrease the threshold of the moment trip.
Usable for increase value an scroll offset for header height.

### `onMore`
`Function` Handler to call then list seek to end.
