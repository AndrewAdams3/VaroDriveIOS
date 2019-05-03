import React from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import { StyleSheet, View, TextInput, Image, ScrollView } from 'react-native';
import {colors} from '../config/styles'
import { connect } from 'react-redux';
import { setEmail, setPassword } from '../redux/store2.js';

const mapStateToProps = (state) => {
  return {
    email: state.email,
    password: state.password,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setEmail: (text) => { dispatch(setEmail(text)) },
    setPassword: (text) => {dispatch(setPassword(text))}
  };
}

class UserInput extends React.Component {
  constructor(props){
    super(props);
    this.state={
      text: ""
    }
  }

  onSubmit = () => {
    console.log(this.props.placeholder)
    switch (this.props.placeholder) {
      case "email":
        this.props.setEmail(this.state.text);
        return;
      case "password":
        this.props.setPassword(this.state.text);
        return;
      default:
        return
    }
  }
  render() {
    return (
      <View style={styles.inputWrapper}>
        <Image source={this.props.source} style={[styles.inlineImg, {width:this.props.scale}, {height:this.props.scale}]} />
        <ScrollView keyboardShouldPersistTaps='handled'>
          <TextInput
            style={styles.input}
            placeholder={this.props.placeholder}
            secureTextEntry={this.props.secureTextEntry}
            autoCorrect={this.props.autoCorrect}
            autoCapitalize={this.props.autoCapitalize}
            returnKeyType={this.props.returnKeyType}
            placeholderTextColor="grey"
            underlineColorAndroid="transparent"
            onFocus={() => this.setState({placeholderTextColor: 'transparent'}) }
            onBlur={this.onSubmit}
            onChangeText={(change) => this.setState({text: change})}
            value={this.state.text}
            onSubmitEditing={this.onSubmit}
          />
        </ScrollView>
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserInput);

UserInput.propTypes = {
  source: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  secureTextEntry: PropTypes.bool,
  autoCorrect: PropTypes.bool,
  autoCapitalize: PropTypes.string,
  returnKeyType: PropTypes.string,
  scale: PropTypes.number.isRequired,
};

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.SECONDARY_BACKGROUND,
    width: DEVICE_WIDTH - 40,
    height: 50,
    marginHorizontal: 20,
    paddingLeft: 45,
    borderRadius: 40,
    color: '#ffffff',
  },
  inputWrapper: {
    flex: 1,
    alignItems: 'center'
  },
  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    left: 35,
    top: 13,
  },
});
