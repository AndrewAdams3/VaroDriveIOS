import React from 'react';
import { View, Text, Platform, StyleSheet, Image, Modal, TouchableOpacity, Keyboard, ScrollView, TextInput, Dimensions } from 'react-native';
import axios from 'axios'
import { connect } from 'react-redux';
import colors from '../config/styles/colors'
import { setLName, setFName, setAddress, setCity, setState } from '../redux/store2'

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    setFName: (text) => { dispatch(setFName(text)) },
    setLName: (text) => { dispatch(setLName(text)) },
    setID: (id) => { dispatch(setID(id)) },
    setCity: (city) => {dispatch(setCity(city))},
    setState: (state) => {dispatch(setState(state))},
    setAddress: (add) => {dispatch(setAddress(add))}
  };
}

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

class UserInfoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboard: false,
      fname: false,
      lname: false,
      city: false,
      state: false,
      address: false,
      formComplete: false,
      incomplete: false,
      modalVisible: false
    }
    this.userId = this.props.navigation.getParam('userId');
    this.bg = require('../config/images/background.png');
    this.logo = require("../config/images/VaroLogo.png");
    this.formComplete = this.state.fname && this.state.lname && this.state.city && this.state.state && this.state.address;
  }

  componentWillMount() {
    this.keyboardDidHideListener = Keyboard.addListener(Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow', this._keyboardDidShow);
    this.keyboardDidShowListener = Keyboard.addListener(Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide', this._keyboardDidHide);
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({keyboard: true});
  }

  _keyboardDidHide = () => {
    this.setState({keyboard: false});
    this.myScroll.scrollTo({x: 0, y: 0, animated: true});
  }

  submitChanges = () => {
    if(this.state.formComplete){
      this.setState({incomplete: false});
      this.setState({modalVisible: !this.state.modalVisible});
    }else{
      this.setState({incomplete: true});
    }
  }

  postChanges = () => {
    var url = 'http://' + constants.ip + ':3210/data/users/update';
    console.log("URL: ", url)
    console.log("params: ", this.state.temp1, this.state.temp2, this.state.temp3);
    axios.put(url, {
      id: this.props.userId,
      fName: this.state.temp1,
      lName: this.state.temp2,
      city: this.state.temp3,
      state: this.state.temp4,
      address: this.state.temp5
    }).then((res) => {
      this.props.setFName(this.state.temp1)
      this.props.setLName(this.state.temp2)
      this.props.setCity(this.state.temp3);
      this.props.setState(this.state.temp4);
      this.props.setAddress(this.state.temp5);

      this.props.navigation.navigate('Home');
    })
  }
  tryFormComplete = async () => {
    this.setState({formComplete: this.state.fname && this.state.lname && this.state.city && this.state.state && this.state.address});
    console.log("complete ? ", this.state.formComplete);
  }

  validateAndSet = async (id) => {
    // Ideally these should be declared in constants.js file
    //const postcodeRegex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})/;
    const addressRegex = /(\d{1,5})(\s\w{0,2}\s{0,1})(\b\w*\b\s){1,2}(\w*)/;
    const twocharRegex = /^(\w[A-Za-z ]{1,57})/;
    switch (id) {
      case "fname":
        if (this.state.temp1 != undefined && this.state.temp1 != ""){
          if(twocharRegex.test(this.state.temp1)){
            this.setState({fname: true});
            await this.tryFormComplete();
            this.focusTheField(1)
            console.log("testing fname: ", twocharRegex.test(this.state.temp1))
          }
        }
        else {
          this.setState({fname: false});
        }
        break;
      case "lname":
        if (this.state.temp2 != undefined && this.state.temp2 != ""){
          if (twocharRegex.test(this.state.temp2)){
            this.setState({ lname: true });
            await this.tryFormComplete();
            this.focusTheField(2)
            console.log("testing fname: ", twocharRegex.test(this.state.temp2))
          }
        }
        else this.setState({ lname: false });
        break;
      case "city":
        if (this.state.temp3 != undefined && this.state.temp3 != ""){
          if (twocharRegex.test(this.state.temp3)){
            this.setState({ city: true });
            await this.tryFormComplete();
            this.focusTheField(3)
            console.log("testing fname: ", this.state.city);
          }
        }
        else this.setState({ city: false });
        break;
      case "state":
        if (this.state.temp4 != undefined && this.state.temp4 != ""){
          if (twocharRegex.test(this.state.temp4)){
            this.setState({ state: true });
            await this.tryFormComplete();
            this.focusTheField(4)
            console.log("testing fname: ", twocharRegex.test(this.state.temp4))
          }
        }
        else this.setState({ state: false });
        break;
      case "address":
        if (this.state.temp5 != undefined && this.state.temp5 != ""){
          if (addressRegex.test(this.state.temp5) === true){
            this.setState({ address: true });
            await this.tryFormComplete();
            console.log("testing address: ", addressRegex.test(this.state.temp5))
          }
        }
        else this.setState({ address: false });
        break;
      default:
        break;
    }
  }

  confirmInfo = () => {
    return(
      <View style={[styles.container, {justifyContent: 'space-around', alignItems: 'center'}]}>
        <View style={{flex: 3, justifyContent: 'space-around'}}>
          <Text style={{color: 'white', fontSize: 18}}>Is the information correct?</Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 3}}>
          <Text style={{ color: 'white', fontSize: 18 }}>{"Name: " + this.state.temp1 + " " + this.state.temp2}</Text>
          <Text style={{ color: 'white', fontSize: 18 }}>{"Address: " + this.state.temp5 + " " + this.state.temp3 + ", " + this.state.temp4}</Text>
        </View>
        <View style={{flexDirection: 'row', flex: 3}}>
          <View style={{ flex: .4, width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
            <TouchableOpacity style={[styles.modalButton, { width: '80%', height: '60%' }]} onPress={this.postChanges}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: .4, width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
            <TouchableOpacity style={[styles.modalButton, { width: '80%', height: '60%' }]} onPress={() => this.setState({ modalVisible: false })}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  // variable to hold the references of the textfields
  inputs = {};

  // function to focus the field
  focusTheField = (id) => {

    this.inputs[id].focus();

  }

  render() {
    var {fname, lname, city, state, address} = this.state;
    var allDone = fname && lname  && city && state && address;
    return (
      <View style={styles.container}>
        <Image source={this.bg} style={styles.background} />
        <Modal
          animationType='fade'
          transparent={true}
          presentationStyle="overFullScreen"
          visible={this.state.modalVisible}
          onRequestClose={() => { () => this.setState({ modalVisible: false }) }}>
          {this.confirmInfo()}
        </Modal>
        <ScrollView 
            contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center', opacity: this.state.modalVisible ? 0 : 1 }}
            ref={(ref) => this.myScroll = ref}
        >
          <View style={{flex: .07, height: HEIGHT * .25, justifyContent: "space-around", alignItems: 'center'}}>  
            <Image source={this.logo} style={styles.logo}/>
          </View>
          <View style={{flex: .1, alignItems: 'center', justifyContent: 'flex-start'}}>
            <Text style={{ fontSize: 16, color: this.state.incomplete && !allDone ? 'red' : 'white'}}>
              {this.state.incomplete && !allDone ? "Please fill in all forms" : "Please fill in your information below"}
            </Text>
          </View>
          <View style={styles.inputs}>
            <View style={[styles.inputContainer, { borderColor: (!this.state.fname && this.state.incomplete) ? 'red' : colors.PRIMARY_BACKGROUND}]}>
              <TextInput
                ref={input => { this.inputs[0] = input }}
                style={{ color: 'white', paddingLeft: 10, height: HEIGHT * .08 }}
                placeholder={"First Name"}
                returnKeyType={"next"}
                placeholderTextColor={"white"}
                underlineColorAndroid="transparent"
                onChangeText={(text) => this.setState({ temp1: text })}
                onSubmitEditing={() => this.validateAndSet("fname")}
                onBlur={() => this.validateAndSet("fname")}
                returnKeyType={"next"}
                autoCorrect={false}
              />
            </View>
            <View style={[styles.inputContainer, { borderColor: (!this.state.lname && this.state.incomplete) ? 'red' : colors.PRIMARY_BACKGROUND }]}>
              <TextInput
                ref={input => { this.inputs[1] = input }}
                style={{ color: 'white', paddingLeft: 10, height: HEIGHT * .08 }}
                placeholder={"Last name"}
                returnKeyType={"next"}
                placeholderTextColor={"white"}
                underlineColorAndroid="transparent"
                onChangeText={(text) => this.setState({ temp2: text })}
                onSubmitEditing={() => this.validateAndSet("lname")}
                onBlur={() => this.validateAndSet("lname")}
                returnKeyType={"next"}
                autoCorrect={false}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.inputContainer, { width: '30%', paddingHorizontal: 10, borderColor: (!this.state.city && this.state.incomplete) ? 'red' : colors.PRIMARY_BACKGROUND }]}>
                <TextInput
                  ref={input => { this.inputs[2] = input }}
                  style={{ color: 'white', paddingLeft: 10, height: HEIGHT * .08 }}
                  placeholder={"city"}
                  returnKeyType={"next"}
                  placeholderTextColor={"white"}
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => this.setState({ temp3: text })}
                  onSubmitEditing={() => this.validateAndSet("city")}
                  onBlur={() => this.validateAndSet("city")}
                  returnKeyType={"next"}
                  autoCorrect={false}
                />
              </View>
              <View style={[styles.inputContainer, { width: '30%', paddingHorizontal: 10, borderColor: (!this.state.state && this.state.incomplete) ? 'red' : colors.PRIMARY_BACKGROUND}]}>
                <TextInput
                  ref={input => { this.inputs[3] = input }}
                  style={{ color: 'white', paddingLeft: 10, height: HEIGHT * .08 }}
                  placeholder={"state"}
                  returnKeyType={"next"}
                  placeholderTextColor={"white"}
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => this.setState({ temp4: text })}
                  onSubmitEditing={() => this.validateAndSet("state")}
                  onBlur={() => this.validateAndSet("state")}
                  returnKeyType={"next"}
                  autoCorrect={false}
                />
              </View>
            </View>
            <View style={[styles.inputContainer, { borderColor: (!this.state.address && this.state.incomplete) ? 'red' : colors.PRIMARY_BACKGROUND }]}>
              <TextInput
                ref={input => { this.inputs[4] = input }}
                style={{ color: 'white', paddingLeft: 10, height : HEIGHT * .08 }}
                placeholder={"123 n fake st."}
                placeholderTextColor={"white"}
                underlineColorAndroid="transparent"
                onChangeText={(text) => this.setState({ temp5: text })}
                onSubmitEditing={() => this.validateAndSet("address")}
                onBlur={() => this.validateAndSet("address")}
                autoCorrect={false}
              />
            </View>
          </View>
          <View style={[styles.buttonsContainer, { opacity: this.state.formComplete ? 1 : .5}]}>
            <TouchableOpacity style={styles.button} onPress={this.submitChanges}>
              <Text style={{ fontSize: 18, color: 'white' }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
  },
  background: {
    position: 'absolute',
    height: HEIGHT,
    width: WIDTH,
    opacity: .9,
    overlayColor: 'grey'
  },
  logo: {
    width: WIDTH * .4,
    opacity: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignSelf: 'center',
    tintColor: 'white'
  },
  inputContainer: {
    margin: 10,
    width: '80%',
    marginHorizontal: 10,
    borderWidth: 3,
    borderRadius: 5
  },
  inputs: {
    width: WIDTH,
    height: HEIGHT * .45,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 15
  },
  buttonsContainer: {
    marginTop: 5,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  button: {
    width: WIDTH * .8,
    height: HEIGHT * .08,
    borderRadius: 40,
    backgroundColor: colors.SECONDARY_BACKGROUND,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modalButton: {
    width: '50%',
    height: 100,
    backgroundColor: colors.PRIMARY_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.SECONDARY_BACKGROUND,
    opacity: .9,
    borderRadius: 10
  },
  buttonText: {
    color: colors.TEXT_COLOR,
    fontSize: 18
  },
})