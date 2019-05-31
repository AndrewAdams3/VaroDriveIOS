import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
export default class ImageButton extends Component{
  constructor(props){
    super(props);
    this.state = {}
  }

  render(){
    return(
      <TouchableOpacity onPress={this.props.onPress} style={this.props.style}>
        {this.props.children}
      </TouchableOpacity>
    )
  }
}