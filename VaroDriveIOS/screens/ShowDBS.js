import React from 'react';
import {
  View,
  Text,
  Picker,
  Dimensions,
  TouchableOpacity, StatusBar,
  StyleSheet, Image,
  ActivityIndicator, Modal,
  FlatList, Platform, ActionSheetIOS
} from 'react-native';
import { colors } from '../config/styles'

import axios from 'axios';
import { connect } from 'react-redux';

import constants from '../config/constants'

import { setID} from '../redux/store2'
import LoadImage from '../components/LoadImage';
import { isIphoneX } from 'react-native-iphone-x-helper';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

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
    setID: (text) => { dispatch(setID(text)) },
  };
}

const SORTS = [
  "cancel",
  "-date",
  "type",
];
SORTNames = [
  "",
  "Date",
  "Type"
]
const LIMIT = [
  "cancel",
  "10",
  "20",
  "30",
  "50"
];

class ShowDBsScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      data: [],
      refresh: false,
      loading: true,
      sort: "-date",
      sortType: "Default",
      showing: "",
      number: 20,
      modal2Visible: false
    }
    this.background = require('../config/images/background.png')
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        "Drivebys"
      ),
      headerTransparent: true,
    }
  };

  componentDidMount = () => {
    this.getDriveBys();
  }

  getDriveBys = () => {
    //this.setState({loading: true});
    var url = 'http://' + constants.ip + ':3210/data/drivebys/byUserId';
    if(this.props.userId){ 
      axios.post(url, {
        id: this.props.userId,
        limit: this.state.number,
        sort: this.state.sort
      }).then(({data}) => {
        if(data.response == 0){
          this.setState({
            data: data.docs,
          }, this.setState({
            refresh: !this.state.refresh,
            loading: false
          }));
        } else {
          console.log("err", data);
        }
      }).then(()=>this.forceUpdate())
    }
  }

  showPic = () => {
    if (this.state.modal2Visible == true) {
      var pic = this.state.showing;
      return (
        <TouchableOpacity style={{ flex: 1, width: WIDTH, height: HEIGHT, justifyContent: 'space-around', alignContent: 'space-around', marginTop: 0 }} onPress={() => this.setState({ modal2Visible: false })}>
          <View style={[styles.container, { marginTop: 0, alignContent: 'space-around', alignItems: 'center' }]}>
            <LoadImage style={{ height: HEIGHT * .8, width: WIDTH * .8, resizeMode: 'contain' }} source={{ uri: pic }} />
          </View>
        </TouchableOpacity>
      )
    }
  }
  listItem = ({ item }) => {
    if(item){
      const d = new Date(item.date)
      return (
        <View style={{ flex: 1, borderBottomColor: 'white', borderBottomWidth: 1, width: WIDTH }}>
          <View style={{ flex: 1, flexDirection: 'row', margin: 5 }}>
            <TouchableOpacity
              style={{ flex: 1, marginTop: 10, justifyContent: 'space-around', alignItems: 'center', borderWidth: 3, borderRadius: 10, borderColor: colors.SECONDARY_BACKGROUND }}
              onPress={() => {
                this.setState({ showing: item.picturePath });
                this.setState({ modal2Visible: true })
              }
              }>
              <Text style={{ textAlign: 'center', color: 'white' }}>Press to See Picture</Text>
            </TouchableOpacity>
            <View style={{ flex: .5 }} />
            <View style={{ marginTop: 10, flex: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
              <Text style={{ textAlign: 'left', color: 'white' }}>
                {"Date Found: " + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear()}
              </Text>
              <Text style={{ textAlign: 'left', color: 'white' }}>
                {"Type: " + item.type}
              </Text>
              <Text style={{ textAlign: 'left', color: 'white' }}>
                {"Vacant? " + (item.vacant == true ? "Yes" : "No")}
              </Text>
              <Text style={{ textAlign: 'left', color: 'white' }}>
                {"Burned? " + (item.burned == true ? "Yes" : "No")}
              </Text>
              <Text style={{ textAlign: 'left', color: 'white' }}>
                {"Boarded? " + (item.boarded == true ? "Yes" : "No")}
              </Text>
            </View>
          </View>
          <Text style={{ textAlign: 'center', padding: 10, fontSize: 18, color: 'white' }}>{item.address}</Text>
        </View>
      )
    }
  }

  dateSort = async () => {
    this.setState({sort: "-date", sortType: "Date"}, await this.getDriveBys);
  }
  typeSort = async () => {
    this.setState({ sort: "type", sortType: "Type" }, await this.getDriveBys);
  }

  onSelectSort = () => {
    ActionSheetIOS.showActionSheetWithOptions(
    { 
      options: SORTNames,
      cancelButtonIndex: 0,
    },
    (index) => {
      if(index != 0)
        this.setState({ sort: SORTS[index], sortType: SORTNames[index] }, this.getDriveBys)
    });
  } 

  onSelectLimit = () => {
    ActionSheetIOS.showActionSheetWithOptions(
    { 
      options: LIMIT,
      cancelButtonIndex: 0,
    },
    (index) => {
      if(index != 0)
        this.setState({ number: LIMIT[index] }, this.getDriveBys)
    });
  } 

  HeaderBar = () => {
    if(Platform.OS === "android"){
      return(
        <View style={{ width: '100%', height: 50, marginTop: 80, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.SECONDARY_BACKGROUND }}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Sort By: </Text>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>{this.state.sortType}</Text>
          <Picker
            selectedValue={this.state.sort}
            style={{ height: 50, width: 50 }}
            onValueChange={(item, index) => {
              this.setState({ sort: item })
              switch (item) {
                case "Date":
                  this.dateSort()
                  break;
                case "Type":
                  this.typeSort()
                  break;
                default:
                  break;
              }
            }}
          >
            <Picker.Item label="Default (Date)" value="Default" />
            <Picker.Item label="Date" value="Date" />
            <Picker.Item label="Type" value="Type" />
          </Picker>
          <View style={{ flex: .5 }} />
          <Text style={{ color: 'white', textAlign: 'right', fontSize: 18 }}>Show: </Text>
          <Picker
            selectedValue={this.state.number}
            style={{ height: 50, width: 50 }}
            onValueChange={(item, index) => {
              this.setState({ number: item }, this.getDriveBys);
            }}
          >
            <Picker.Item label="Default (30)" value={30} />
            <Picker.Item label="10" value={10} />
            <Picker.Item label="20" value={20} />
            <Picker.Item label="30" value={30} />
            <Picker.Item label="50" value={50} />
          </Picker>
        </View>
      )
    } else if(Platform.OS === "ios") { 
      return(
        <View style={{ width: '100%', height: 50, marginTop: 100, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: colors.SECONDARY_BACKGROUND }}>
          <TouchableOpacity onPress={this.onSelectSort}>
            <Text style={{color: 'white', textAlign: 'right', fontSize: 18 }}>
              {"Sort By: " + this.state.sortType}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onSelectLimit}>
            <Text style={{color: 'white', textAlign: 'right', fontSize: 18 }}>
              {"Showing: " + this.state.number}
            </Text>
          </TouchableOpacity>
        </View>    
      )
    }
  }

  render(){
    return this.state.loading ? (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle='dark-content' />
      </View >
    ) : (
      <View style={[styles.container, this.state.modal2Visible ? { opacity: .8 } : {}]}>
        <Modal
          animationType='fade'
          transparent={true}
          presentationStyle="overFullScreen"
          visible={this.state.modal2Visible}
          onRequestClose={() => { () => this.setState({ modal2Visible: false }) }}>
          {this.showPic()}
        </Modal>
        <Image source={this.background} style={styles.background} />
        <this.HeaderBar/>
        <View style={{ flex: 3, alignContent: 'center', justifyContent: 'space-around' }}>
          <FlatList
            data={this.state.data}
            extraData={this.state.refresh}
            renderItem={this.listItem}
            keyExtractor={(item, index) => {return item ? item._id : index.toString() }}
            showsVerticalScrollIndicator={false}
            windowSize={31}
            removeClippedSubviews={true}
            initialNumToRender={this.state.number / 2}
          />
        </View>
        <View style={{ marginBottom: isIphoneX() ? 25 : 0 }} />
      </View>
    )
  }
}

const styles=StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: .9,
    overlayColor: 'grey'
  },
  button: {
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

export default connect(mapStateToProps, mapDispatchToProps)(ShowDBsScreen);