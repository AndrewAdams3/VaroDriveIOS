import React from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet, Image, FlatList, Modal } from 'react-native';
import { colors } from '../config/styles'
import constants from '../config/constants'
import axios from 'axios';
import CalendarPicker from 'react-native-calendar-picker'
import { connect } from 'react-redux';
//import { setEmail, setPassword, isLoggedIn, setID } from '../redux/store2';

const mapStateToProps = (state) => {
  return {
    email: state.email,
    password: state.password,
    userId: state.userId
  };
}

const mapDispatchToProps = (dispatch) => {
  return {

  };
}

class TimeSheet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      times: [],
      tTime: 0,
      modalVisible: false,
      selectedEndDate: null,
      selectedStartDate: null
    }
    this.background = require('../config/images/psbackground.png');
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        "Time Sheet"
      ),
      headerTransparent: true,
    }
  };

  componentDidMount(){
    var url = 'https://' + constants.ip + ':3210/data/times/byId/' + this.props.userId + "/" + "30";
    axios.get(url).then(({data}) => {
      this.setState({times: data});
    })
  }

  componentWillUnmount(){
    this.setState({modalVisible: false});
  }

  pad = (size, num) => {
    var sign = Math.sign(num) === -1 ? '-' : '';
    return sign + new Array(size).concat([Math.abs(num)]).join('0').slice(-size);
  }

  getTotal = (total) => {
    var hour, minute, seconds;
    seconds = Math.floor(total / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    //return `${hour}:${minute}:${seconds}`

    return this.pad(hour > 99 ? 3 : 2, hour) + ":" + this.pad(2, minute);
  }
  msToTime = (duration, running) => {
    if (!running) {
      var d = new Date(duration);
      var hours = d.getHours();
      hours = hours > 12 ? hours - 12 : hours;
      var minutes = d.getMinutes();
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      if (!running) hours = hours == 0 ? 12 : hours;
      return hours + ":" + minutes;
    }
    else {
      var minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);
      hours = (hours < 10) ? "0" + hours : hours;
     // hours = (hours > 12) ? hours - 12 : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      return hours + ":" + minutes;
    }
  }

  listItem = ({item}) => {
    if(item)
      return(
        <View style={styles.listItem}>
          <Text style={styles.listText}>
            {(this.getDate(item))}
          </Text>
          <Text style={styles.listText}>
            {this.getStart(item)}
          </Text>
          <Text style={styles.listText}>
            {this.getEnd(item)}
          </Text>
          <Text style={[styles.listText, {flex: .8}]}>
            {this.getTotal(item.totalTime)}
          </Text>
        </View>
      )
  }
  getDate = (item) => {
    var date = new Date(item.startTime);
    return (date.getMonth()+1) + "/" + (date.getDate()) + "/" + date.getFullYear();
  }
  getStart = (item) => {
    var temp = new Date(item.startTime);
    return item.startTime != -1 ? (this.msToTime(item.startTime, false) + (temp.getHours() > 12 ? "\nPM" : "\nAM")) : "In Progress"
  }
  getEnd = (item) => {
    var temp = new Date(item.endTime);
    return item.endTime != -1 ? (this.msToTime(item.endTime, false) + (temp.getHours() > 12 ? "\nPM" : "\nAM")) : "In Progress"
  }

  timeWorked = () => {
    this.state.times.map((time) => {
      if(time.totalTime > 0)
        this.setState({ tTime: this.state.tTime + time.totalTime });
    })
    return this.state.tTime;
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

/*   separator = () => {
    return(
      <View style={{height: 1, backgroundColor: 'white', marginHorizontal: 10}}/>
    )
  } */

  onDateChange = (date, type) => {
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: new Date(date),
      });
    } else {
      this.setState({
        selectedStartDate: new Date(date),
        selectedEndDate: null,
      });
    }
  }

  showCalendar = () =>{
    return(
    <View style={{flex: 1, paddingTop: 30}}>
      <CalendarPicker
        startFromMonday={true}
        allowRangeSelection={true}
        todayBackgroundColor="#f2e6ff"
        selectedDayColor="#7300e6"
        selectedDayTextColor="#FFFFFF"
        onDateChange={this.onDateChange}
      />
      <View style={[styles.buttonsContainer, { position: 'absolute' }]}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => this.modalClose()}>
          <Text style={styles.buttonText}>Close Calendar</Text>
        </TouchableOpacity>
      </View>
    </View>
    )
  }
  sortDates = () => {
    var url = 'https://' + constants.ip + ':3210/data/times/byId/' + this.props.userId + "/" + this.state.selectedStartDate + "/" + this.state.selectedEndDate;
    axios.get(url).then(({data}) => {
        this.setState({times: data});
        this.setState({
          refresh: !this.state.refresh
        });
    })
  }

  modalClose = () => {
    this.setState({ modalVisible: false });
    this.sortDates();
    this.forceUpdate();
  }

  getTotalTime = () => {
    var total = 0;
    if(this.state.times.length){
      this.state.times.forEach((time) => {
        if (time) {
          total += time.totalTime
        }
      })
      var hour, minute, seconds;
      seconds = Math.floor(total / 1000);
      minute = Math.floor(seconds / 60);
      seconds = seconds % 60;
      hour = Math.floor(minute / 60);
      minute = minute % 60;
      return `${hour}:${minute}`
    } else {
      return "00:00"
    }
  }

  render(){
    return(
      <View style={styles.container}>
      <View style={styles.iphoneXTop}/>
      <Image style={styles.background} source={this.background} />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {this.modalClose()}}>
            {this.showCalendar()}
        </Modal>
        <View style={styles.topContainer}>
          <View style={styles.selectedDate}>
            <Text style={styles.headerText}>
              {this.state.selectedStartDate ? (this.state.selectedStartDate.getMonth() + 1) + "/" + this.state.selectedStartDate.getDate() + "/" + this.state.selectedStartDate.getFullYear() : "Start Date"}
            </Text>
          </View>
          <View style={{width: 2, backgroundColor: 'white'}}/>
          <View style={styles.selectedDate}>
            <Text style={[styles.headerText]}>
              {this.state.selectedEndDate ? (this.state.selectedEndDate.getMonth() + 1) + "/" + this.state.selectedEndDate.getDate() + "/" + this.state.selectedEndDate.getFullYear() : "End Date"}
            </Text>
          </View>
        </View>
        <View style={styles.totalTimeContainer}>
          <Text style={styles.headerText}>
            {"Hours Worked: " + this.getTotalTime()}
          </Text>
        </View>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Date</Text>
          <Text style={styles.headerText}>Start</Text>
          <Text style={styles.headerText}>End</Text>
          <Text style={styles.headerText}>Total</Text>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={this.state.times}
            extraData={this.state.refresh}
            renderItem={this.listItem}
            keyExtractor={(item, index) => {return item ? item._id : index.toString()}}
            showsVerticalScrollIndicator={false}
//            ItemSeparatorComponent={this.separator}
          />
        </View>
        <View style={[styles.buttonsContainer, {flex: 1.5}]}>
          <TouchableOpacity style={[styles.button, {width: '80%', height: '80%'}]} onPress={() => this.setState({modalVisible: true})}>
            <Text style={styles.buttonText}>Choose Dates</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: colors.PRIMARY_BACKGROUND
  },
  iphoneXTop: {
    height: Platform.OS === "ios" ? 100 : 80
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: .9,
    overlayColor: 'grey'
  },
  topContainer: {
    backgroundColor: colors.SECONDARY_BACKGROUND, 
    flexDirection: 'row',
    opacity: .9, 
    flex: 1, 
    borderBottomWidth: 2, 
    borderBottomColor: 'white',
    justifyContent: 'space-around', 
    alignContent: 'center'
  },
  selectedDate: { 
    flex: 1, 
    justifyContent: 'space-around', 
    alignItems: 'center' 
  },
  totalTimeContainer: {
    flex: 1, 
    backgroundColor: colors.PRIMARY_BACKGROUND, 
    opacity: .9, 
    justifyContent: 'space-around', 
    alignContent: 'center'
  },
  tableHeader: {
    flex: 1, 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    backgroundColor: colors.PRIMARY_BACKGROUND, 
    opacity: .9
  },
  listContainer: { 
    marginVertical: 10, 
    flex: 6, 
    alignContent: 'center', 
    justifyContent: 'center' 
  },
  listItem: {
    marginHorizontal: 10, 
    paddingHorizontal: 20, 
    paddingVertical: 20, 
    borderWidth: 1, 
    borderColor: 'white', 
    justifyContent: 'space-between', 
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', 
    backgroundColor: colors.SECONDARY_BACKGROUND, 
    opacity: .9
  },
  listText: { 
    textAlign: 'center', 
    fontSize: 18,
    color: 'white',
    flex: 1
  },
  headerText: { 
    fontSize: 24, 
    textAlign: 'center',
    fontWeight: '400',
    color: 'white'
  },
  buttonsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 0,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(TimeSheet);