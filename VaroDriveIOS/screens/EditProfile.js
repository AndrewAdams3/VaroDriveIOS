import React from 'react';
import {
  View, Text,
  Dimensions,
  StyleSheet, Image,
  ScrollView, TextInput,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-picker'
import axios from 'axios';

import { setFName, setLName, setPic, setEmail, setCity, setState } from '../redux/store2';
import colors from '../config/styles/colors'
import ImageButton from '../components/imageButton.js';
import { isIphoneX } from 'react-native-iphone-x-helper';


const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
    fName: state.fName,
    lName: state.lName,
    profilePic: state.profilePic,
    email: state.email,
    city: state.city,
    state: state.state,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFName: (text) => { dispatch(setFName(text)) },
    setLName: (text) => { dispatch(setLName(text)) },
    setPic: (pic) => { dispatch(setPic(pic)) },
    LOG_OUT: () => { dispatch(LOG_OUT()) },
    setEmail: (text) => { dispatch(setEmail(text)) },
    setCity: (text) => { dispatch(setCity(text)) },
    setState: (text) => { dispatch(setState(text)) },
  };
}

class EditProfile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      fn: "",
      profilePic: this.props.profilePic
    }
    this.background = require('../config/images/psbackground.png')
    this.right = require('../config/images/trighticon.png')
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        "Edit Profile"
      ),
      //headerTransparent: true,
    }
  };

  submitChanges = () => {
    var url = 'https://' + constants.ip + ':3210/data/users/update';
    var fName = this.state["First Name"] == undefined ? this.props.fName : this.state["First Name"]
    var lName = this.state["Last Name"] == undefined ? this.props.lName : this.state["Last Name"]
    var email = this.state["Email"] == undefined ? this.props.email : this.state["Email"]
    var city = this.state["City"] == undefined ? this.props.city : this.state["City"]
    var state = this.state["State"] == undefined ? this.props.state : this.state["State"]
    axios.put(url, {
      id: this.props.userId,
      fName: fName,
      lName: lName,
      email: email,
      city: city,
      state: state,
    }).then((res) => {
      this.props.setFName(fName)
      this.props.setLName(lName)
      this.props.setEmail(email)
      this.props.setCity(city)
      this.props.setState(state)
    })
    this.props.navigation.navigate("Profile")
  }

  openCamera = () => {
    ImagePicker.launchImageLibrary({}, async (response) => {

      if (response.didCancel) {
        return
      } else if (response.error) {
        return
      } else if (response.customButton) {
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
          this.submitPic()
        }
      }
    });
  }

  submitPic = async () => {
    var url = 'https://' + constants.ip + ':3210/data/users/profilePic';

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
      if (res.data.response == 0) {
        url = 'https://' + constants.ip + ':3210/data/users/profilePic';
        await axios.put(url, {
          value: res.data.path,
          id: this.props.userId
        }).then((res2) => {
          if (res2.data.success) {
            var p = res.data.path.replace(/\\/g, "/");
            this.setState({ profilePic: p })
            this.props.setPic(p);
          }
        }).catch((err) => {
          
        })
      }
    }, (err) => {
    })
  }

  pic = () => {
    return(
      <ImageButton onPress={this.openCamera} style={{ flex: 1, margin: 15, justifyContent: 'space-around', alignItems: 'center', alignSelf: 'center' }}>
        <FastImage
          onError={() => {
            this.setState({
              profilePic: "file/uploads/profilePics/default.jpg"
            })
          }}
          style={styles.profilePic}
          source={{uri:('https://' + constants.ip + ':3210/' + this.state.profilePic)}}
        />
      </ImageButton>
    )
  }

  field = (p) => {
    return (
      <View style={[styles.inputContainer, {width: '80%'}]}>
        <TextInput
          style={styles.tInput}
          placeholder={p.title + "..."}
          returnKeyType={"done"}
          placeholderTextColor={"white"}
          underlineColorAndroid="transparent"
          onChangeText={(text) => this.setState({ [p.title]: text })}
          maxLength={p.title === "State" ? 2 : null}
        />
      </View>
    )
  }

  showChanges = (p) => {
    return(
      <View style={styles.field}>
        <View style={styles.resultContainer}>
          <Text numberOfLines={1} style={{ color: 'white', textAlign: "left" }}>{p.old || (p.title + "...")}</Text>
        </View>
        <Image source={this.right} style={styles.indicator} />
        <View style={[styles.resultContainer, { padding: 10, borderColor: this.state[p.title] ? 'green' : colors.PRIMARY_BACKGROUND}]}>
          <Text numberOfLines={1} style={{color: 'white', textAlign: "left"}}>{this.state[p.title] || p.old}</Text>
        </View>
      </View>
    )
  }

  render(){
    return(
      <View style={styles.container}>
        <ScrollView>
          <Image source={this.background} style={styles.background} />
           <View style={styles.main}>
            <this.pic />
            <this.field title="First Name"/>
            <this.field title="Last Name"/>
            <this.field title="Email" />
            <this.field title="City" />
            <this.field title="State" />
            <Text style={styles.confirm}>Change Password?</Text>
            <this.field title="New Password" />
            <this.field title="Confirm Password" />
            <Text style={styles.confirm}>Confirm Changes</Text>
            <this.showChanges title="First Name" old={this.props.fName} />
            <this.showChanges title="Last Name" old={this.props.lName} />
            <this.showChanges title="Email" old={this.props.email} />
            <this.showChanges title="City" old={this.props.city} />
            <this.showChanges title="State" old={this.props.state} />
          </View>
          <View style={[styles.buttonsContainer, { margin: 0 }]}>
            <TouchableOpacity style={styles.button} onPress={() => { this.submitChanges() }}>
              <Text style={{ fontSize: 18, color: 'white' }}>Submit</Text>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: isIphoneX() ? 25 : 0}}/>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: .9,
    overlayColor: 'grey'
  },
  main: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  field: {
    flex: .5,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  inputContainer: {
    margin: 5,
    padding: 10,
    height: 50,
    marginHorizontal: 10,
    borderWidth: 3,
    borderColor: colors.PRIMARY_BACKGROUND,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  resultContainer: {
    flex: .5,
    margin: 5,
    width: '40%',
    marginHorizontal: 10,
    borderWidth: 3,
    borderColor: colors.PRIMARY_BACKGROUND,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tInput: {
    height: 50,
    color: 'white',
    width: "100%"
  },
  indicator: {
    height: 30,
    width: 30,
    tintColor: 'white',
    alignSelf: 'center',
  },
  confirm: {
    color: 'white',
    fontSize: 20,
    alignSelf: 'center',
    padding: 15
  },
  buttonsContainer: {
    width: '100%',
    paddingRight: 30,
    paddingLeft: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    height: 50,
    width: '50%',
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.SECONDARY_BACKGROUND,
    backgroundColor: colors.PRIMARY_BACKGROUND,
    opacity: .9,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    height: 160,
    width: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: colors.PRIMARY_BACKGROUND,
    alignSelf: 'center'
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);