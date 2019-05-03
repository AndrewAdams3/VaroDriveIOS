import React from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native'

const Dimensions = require('Dimensions')
const screenWidth = Dimensions.get('window').width

export default class SideMenu extends React.Component {
  constructor() {
    super()
    // Sets up this component's initial state
    this.state = {
      offset: 0,                           // Offset from the side (none on left, 25% on right)
      animatedLeft: new Animated.Value(0), // The animatable version of the left margin
      notDone: true                        // Are you done swiping?
    }
  }

  componentWillMount() {
    // Set up pan responders to listen for swipes and act on them
    this._panGesture = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10,
      onPanResponderGrant: () => this.left = 0,
      onPanResponderMove: (evt, gestureState) => this.moveCenterView(gestureState.dx),
      onPanResponderRelease: () => this.moveFinished(),
      onPanResponderTerminate: () => this.moveFinished(),
    })
  }

  componentDidMount() {
    // Set up a listener to watch for changes to the animated Left value
    // This should only ever fire if you just finished a swipe so that it can
    // animate you to the correct side of the screen if you didn't swipe all the way
    this.state.animatedLeft.addListener(({value}) => {
      if ( this.center && !this.state.notDone) 
        this.center.setNativeProps({left: value})
    })
  }

  moveCenterView(left) {
    // Tell the animation not to register any changes to the left value
    this.state.notDone = true
    // If there is no reference to the view yet, ignore this
    if (!this.center) return
    // The left value is a sum of the offset from the edge of the screen and the left value
    this.left = this.state.offset + left < 0 ? -this.state.offset : left
    // To get to an edge, add your offset + your left value.
    this.state.animatedLeft.setValue(this.state.offset + this.left)
    // Also update the view with this value
    this.center.setNativeProps({left: this.state.offset + this.left})
  } 

  moveFinished() {
    // Make sure there is a reference to the view before you say you're done swiping
    if (!this.center) return
    // Tell the animation it can do its thing when it's told to
    this.state.notDone = false
    // Finds the current offset
    let offset = this.state.offset + this.left
    // If you are coming from the left
    if (this.state.offset === 0) {
      // If you swiped at least 25% of the screen
      if (offset > screenWidth * 0.25)
        // Set the new offset to 25% from the right 
        this.state.offset = screenWidth * 0.75
    } else {
      // If you are coming from the right and swiped past 50% of the screen
      if (offset < screenWidth * 0.5)
        // Set the offset to be 0 (all the way on the left)
        this.state.offset = 0             
    }

    // Animate the view to the new offset (the user didn't drag all the way to the correct spot so we need to finish it)
    Animated.timing( this.state.animatedLeft, {
      toValue: this.state.offset,                  
      duration: 400,              
    }).start(); 
  }

  render() {
    // Prepare the components we passed into this component
    let centerView = this.props.renderCenterView ? this.props.renderCenterView() : null
    let leftView = this.props.renderLeftView ? this.props.renderLeftView() : null

    return (
      <View style={[{flex: 1}, this.props.style]}>
        <View style={styles.left}>
          {/* Renders the Menu */}
          {leftView}
        </View>
        <View
          style={{flex: 1, left: this.state.offset}}
          ref={(center) => this.center = center}
          {...this._panGesture.panHandlers}>
          {/* Renders the App View */}
          {centerView}
        </View>
      </View>
    )
  }
}


var styles = StyleSheet.create({
  left: {
    position: 'absolute',
    top:0,
    left:0,
    bottom:0,
    right: 0,
  }
})
