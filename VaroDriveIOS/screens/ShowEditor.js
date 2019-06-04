import React from 'react'
import {View, ScrollView, Dimensions, Image, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../config/styles/colors'
import axios from 'axios'

import {setFName, setLName, setPic} from '../redux/store2';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-picker'
import ImageButton from "../components/imageButton.js";


const HEIGHT = Dimensions.get("screen").height
const WIDTH = Dimensions.get("screen").width;

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
    fName: state.fName,
    lName: state.lName,
    profilePic: state.profilePic
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFName: (text) => { dispatch(setFName(text)) },
    setLName: (text) => { dispatch(setLName(text)) },
    setPic: (pic) => { dispatch(setPic(pic)) },
  };
}

class ShowEditor extends React.Component{
  constructor(props){
    super(props);
    this.state={
      profilePic: this.props.pic
    }
    console.log("IDTEST: ", this.props.userId);
    console.log("pic:", this.props.profilePic)
    this.bg = require('../config/images/background.png')
    this.edit = require('../config/images/edit.png');
  }

  submitChanges = () => {
    var url = 'http://' + constants.ip + ':3210/data/users/update';
    var fName = this.state.temp1 == undefined ? this.props.fName : this.state.temp1
    var lName = this.state.temp2 == undefined ? this.props.lname : this.state.temp2
    axios.put(url, {
      id: this.props.userId,
      fName: fName,
      lName: lName
    }).then((res) => {
      this.props.setFName(fName)
      this.props.setLName(lName)
    })
    this.props.close()/* this.setState({ profileEditor: false }) */
  }

  openCamera = () => {
    console.log("camera opening");
    ImagePicker.launchImageLibrary({}, async (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
        return
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        return
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        //const source = { uri: response.uri };
        // You can also display the image using data:
        const source = { uri: 'data:image/jpeg;base64,' + response.data };

        const data = new FormData();
        data.append('name', 'avatar');
        data.append('image', {
          uri: response.uri,
          type: response.type,
          name: response.fileName
        });

        if (source != "") {
          this.setState({
            post: data
          });
          this.handleSubmit()
        }
      }
    });
  }

  handleSubmit = async () => {
    var url = 'http://' + constants.ip + ':3210/data/users/profilePic';

    const type = "profilePic"
    const post = this.state.post
    post.append('type', type);

    const config = {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data'
      },
      body: post,
    };

    await axios.post(url, post, config).then(async (res) => {
      console.log("message: " + res.data.path);
      if (res.data.response == 0) {
        console.log("sending rest of data...");
        url = 'http://' + constants.ip + ':3210/data/users/profilePic';
        await axios.put(url, {
          value: res.data.path,
          id: this.props.userId
        }).then((res2) => {
          if (res2.data.success) {
            var p = res.data.path.split('/');
            p = p.join('/');
            this.setState({ profilePic: 'http://' + constants.ip + ':3210/' + p})
            this.props.setPic(p)
            this.props.changePic(p);
            console.log("success");
          }
        }).catch((err) => console.log(err))
      }
    }, (err) => {
      console.log(err);
    })
  }

  top = () => {
    return (
      <View style={{ flex: 1, width: '60%'}}>
        <ImageButton style={{ flex: 1, margin: 15}}>
          <FastImage
            onError={(e) => { this.setState({ profilePic: 'http://' + constants.ip + ':3210/' + this.props.profilePic }) }}
            style={styles.profilePic}
            source={{ uri: this.state.profilePic }}
          />
        </ImageButton> 
{/*         <View style={{ height: 15, width: 15, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'white' }}> */}          
          <FastImage
            onError={(e) => { this.setState({ profilePic: 'http://' + constants.ip + ':3210/' + this.props.profilePic }) }}
            style={[styles.editPic, {right: 170, top: 125}]}
            source={this.edit}
          />
{/*         </View> */}
      </View> 
    )
  }
   
  form = () => {
    return (
      <View style={{ flex: 1.5, alignItems: 'center', justifyContent: "space-around" }}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.tInput}
            // value={"First Name"}
            placeholder={"First name..."}
            returnKeyType={"next"}
            placeholderTextColor={"white"}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({ temp1: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.tInput}
            placeholder={"Last name..."}
            returnKeyType={"next"}
            placeholderTextColor={"white"}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({ temp2: text })}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.tInput}
            // value={"First Name"}
            placeholder={"Email address..."}
            returnKeyType={"next"}
            placeholderTextColor={"white"}
            underlineColorAndroid="transparent"
            onChangeText={(text) => this.setState({ temp1: text })}
          />
        </View>
        <View style={{ flexDirection: 'row', margin: 10 }}>
          <View style={[styles.inputContainer, { width: '40%' }]}>
            <TextInput
              style={{ color: 'white', paddingLeft: 10 }}
              // value={"First Name"}
              placeholder={"New password..."}
              returnKeyType={"next"}
              placeholderTextColor={"white"}
              underlineColorAndroid="transparent"
              onChangeText={(text) => this.setState({ temp1: text })}
            />
          </View>
          <View style={[styles.inputContainer, { width: '40%' }]}>
            <TextInput
              style={{ color: 'white', paddingLeft: 10 }}
              // value={"First Name"}
              placeholder={"Confirm password..."}
              returnKeyType={"next"}
              placeholderTextColor={"white"}
              underlineColorAndroid="transparent"
              onChangeText={(text) => this.setState({ temp1: text })}
            />
          </View>
        </View>
      </View>
    )
  }
  
  submit = () => {
    return (
      <View style={{ flex: .5, width: '100%', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
        <TouchableOpacity style={styles.button} onPress={() => this.openCamera()}>
          <Text style={styles.buttonText}>Change Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => this.submitChanges()}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
        
  render(){
    return (
      <View style={[styles.container, { marginTop: 0, alignItems: 'center', padding: 10 }]}>
      <Image source={this.bg} style={styles.bg}/>
        <this.top />
        <this.form />
        <this.submit />
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowEditor);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    marginTop: 80
  },
  bg: {
    position: 'absolute',
    opacity: .9,
    height: HEIGHT,
    width: WIDTH,
    overlayColor: 'grey'
  },
  button: {
    width: '40%',
    height: 70,
    backgroundColor: colors.PRIMARY_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.SECONDARY_BACKGROUND,
    opacity: .9,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.TEXT_COLOR,
    fontSize: 18
  },
  inputContainer: { 
    margin: 5, 
    width: '80%', 
    marginHorizontal: 10, 
    borderWidth: 3, 
    borderColor: colors.PRIMARY_BACKGROUND, 
    borderRadius: 5 
  },
  profilePic: {
    height: 160,
    width: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: colors.PRIMARY_BACKGROUND,
    position: 'absolute',
    alignSelf: 'center'
  },
  tInput: { 
    color: 'white', 
    paddingLeft: 10, 
    width: WIDTH * .5 
  },
  editPic: {
    height: 40,
    width: 40,
    marginLeft: WIDTH * .2,
    marginTop: 20,
    position: 'absolute',
    alignSelf: 'flex-start',
    transform: [{ rotateZ: '180deg' }]
  },
})