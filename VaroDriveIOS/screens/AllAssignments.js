import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { colors } from '../config/styles'
import Axios from 'axios';
import { connect } from 'react-redux';
import constants from '../config/constants'
import { isIphoneX } from 'react-native-iphone-x-helper';

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

class AllAssignmentsScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      collapsed: true,
      activeSections: [],
      multipleSelect: false,
      assignments: [],
      count: 0,
      task: {}
    };
    this.bg = require('../config/images/psbackground.png');
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
    Axios.get('https://' + constants.ip + ':3210/data/assignments/byId/' + this.props.userId)
      .then(({ data }) => {
        this.setState({ assignments: data, count: data.length });
      })
    Axios.get('https://' + constants.ip + ':3210/data/assignments/target/byId/' + this.props.userId)
      .then(({data})=>{
        this.setState({task: data})
      })
  }

  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  setSections = sections => {
    this.setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  };

  openAll = () => {
    let sections = []
    for(var i = 0; i < this.state.count; i++){
      sections.push(i);
    }
    this.setState({
      activeSections: sections
    })
  }

  closeAll = () => {
    this.setState({
      activeSections: []
    })
  }

  renderHeader = (ass, _, isActive) => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{new Date(ass.Date).toLocaleDateString()}</Text>
        <Text style={styles.headerText}>{ass.completed ? "Complete" : "Incomplete"}</Text>
      </View>
    );
  };

  renderContent(ass, _, isActive) {
    return (
      <View
        style={[styles.content]}
      >
      {
        ass.Addresses.map(({address, completed}, index) => {
          return (
            <View key={ass._id + address + index} style={{flex: 1, flexDirection:"row", width: "100%", borderBottomWidth: 2, borderBottomColor: colors.PRIMARY_BACKGROUND}}>
              <Text style={styles.contentStyle}>
                {address}
              </Text>
              <Text style={[styles.contentStyle, {textAlign: "right", color: completed ? "green" : "red"}]}>
                {completed ? "Complete!" : "Incomplete"}
              </Text>
            </View>
          )
        })
      }
      <Text style={[styles.contentStyle, {width: "100%"}]}>{ass.notes}</Text>
      </View>
    )
  }

  render() {
    const { activeSections } = this.state;

    return (
      <View style={styles.container}>
        <Image source={this.bg} style={styles.background} />
        <View style={{flex: 1, padding: 5, paddingTop: Platform.OS === "ios" ? 120 : 100}}>
          <View style={{flex: .3, width: "100%", justifyContent: "flex-start", padding: 5, marginBottom: 10}}>
            <Text style={{color: "white", fontSize: 20}}>-Current Target: {"\n\t"}<Text style={{fontSize: 22}} adjustsFontSizeToFit={true}>{this.state.task.area}</Text></Text>
            <Text style={{color: "white", fontSize: 20}}>-Date Assigned: {"\n\t"}<Text style={{fontSize: 22}}>{new Date(this.state.task.date).toLocaleDateString()}</Text></Text>            
          </View>
          <View style={{flex: 1}}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={this.openAll}>
              <Text style={{ textAlign: "center", color: "white" }}>Open All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={this.closeAll}>
              <Text style={{ textAlign: "center", color: "white" }}>Close All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ paddingTop: 10 }} showsVerticalScrollIndicator={false}>
            <View style={{height: "100%", flex: 1, marginBottom: 80}}>
              <Accordion
                activeSections={activeSections}
                sections={this.state.assignments}
                touchableComponent={TouchableOpacity}
                expandMultiple={true}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent}
                onChange={this.setSections}
                sectionContainerStyle={{backgroundColor:colors.PRIMARY_BACKGROUND, marginVertical:2, padding:5, borderRadius:5}}
              />
            </View>
          </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
   background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: .9,
    overlayColor: 'grey'
  },
  header: {
    backgroundColor: colors.PRIMARY_BACKGROUND,
    margin: 10,
    width: "100%",
    flexDirection: "row"
  },
  headerText: {
    textAlign: 'center',
    fontSize: 18,
    color: "white",
    width: "50%"
  },
  content: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8
  },
  contentStyle: {
    color: "black",
    width: "50%",
    fontSize: 16
  },
  buttonsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    height: 50,
    width: '40%',
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.SECONDARY_BACKGROUND,
    backgroundColor: colors.PRIMARY_BACKGROUND,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AllAssignmentsScreen);