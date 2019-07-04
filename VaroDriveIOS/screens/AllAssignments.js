import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SectionList} from 'react-native';
import { colors } from '../config/styles'
import UserInput from '../components/UserInput'
import { images } from '../config/images'
import axios from 'axios';
import { connect } from 'react-redux';
import { setEmail, setPassword, isLoggedIn, setID } from '../redux/store2';
import constants from '../config/constants'

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const ACCESS_TOKEN = 'access_token';

const mapStateToProps = (state) => {
  return {
    userId: state.userId
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setID: (id) => { dispatch(setID(id)) }
  };
}

class AllAssignmentsScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      assignments: [],
      refresh: true,
      number: 20
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        "All Assignments"
      ),
      headerTransparent: true,
    }
  };

  componentDidMount() {
    this.populate();
  }

  populate = () => {
    axios.get('http://' + constants.ip + ':3210/data/assignments/byId/incomplete/' + this.props.userId)
      .then(({ data }) => {
        let sortedData = []
        if (data)
          sortedData = data.sort((a, b) => {
            if (a.Date > b.Date) return -1;
            else if (a.Date < b.Date) return 1;
            else return 0;
          })
        this.setState({ assignments: sortedData, refresh: !this.state.refresh });
      })
  }
  render(){
    return(
      <View style={styles.container}>
        <SectionList
          data={this.state.assignments}
          extraData={this.state.refresh}
          sections={this.state.assignments.map((ass, index) => { return ({ date: new Date(ass.Date).toDateString(), ass: ass, data: ass.Addresses })})}
          renderSectionHeader={({ section }) => <Text style={{color: "black"}}>{section.data.length > 0 ? section.date : null}</Text>}
          renderItem={({item}) => {return(<Text style={{color:"black"}}>{item.address}</Text>)}}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: 80
  },
  background: {
    position: 'absolute',
    /* height: HEIGHT,
    width: WIDTH, */
    height: '100%',
    width: '100%',
    opacity: .9,
    overlayColor: 'grey'
  },
})
export default connect(mapStateToProps, mapDispatchToProps)(AllAssignmentsScreen);