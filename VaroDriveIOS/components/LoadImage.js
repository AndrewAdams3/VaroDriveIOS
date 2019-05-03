import React, { Component } from "react";
import {Image, ActivityIndicator, View} from 'react-native'

export default class LoadImage extends Component {

  constructor(props){
    super(props);
    this.state={
      show: true
    }
  }
  render(){
    const {
      source,
      style,
      ...props
    } = this.props;
    return(
      <View style={{flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
        {this.state.show && <ActivityIndicator style={{position: 'absolute'}} />}
        <Image {...props}
          source={source}
          style={style}
          onLoad={() => this.setState({show: false})}
        />
      </View>
    )
  }
}