// Library Imports
import { createSwitchNavigator, createStackNavigator, createAppContainer, createMaterialTopTabNavigator} from 'react-navigation'
import React from 'react';
import { ifIphoneX } from 'react-native-iphone-x-helper'

// Component Imports
import SlideMenu from '../components/SlideMenu'
import LeftMenu from '../components/LeftMenu'
// Route Imports
import HomeScreen from '../screens/Home/Home.js'
import SignUpScreen from '../screens/SignUp/SignUp.js'
import AuthScreen from '../screens/Auth.js'
import LandingScreen from '../screens/Landing.js'
import TimeInScreen from '../screens/TimeIn.js'
import TimeSheet from "../screens/TimeSheet.js"
import NewDBScreen from '../screens/NewDB.js'
import ProfileScreen from "../screens/Profile.js";
import NotVerifiedScreen from '../screens/NotVerified.js';
import EditProfile from '../screens/EditProfile.js';
import UserInfoScreen from '../screens/UserInfo.js';
import AssignmentDBScreen from '../screens/AssignmentDB';
import AllAssignmentsScreen from '../screens/AllAssignments';
import ShowDBsScreen from '../screens/ShowDBS';
import { colors } from './styles';


const SetupStack = createStackNavigator({
  NotVerified: NotVerifiedScreen,
  UserInfo: UserInfoScreen
},{
  initialRouteName: "NotVerified",
  headerMode: 'none',
  cardStyle: { shadowColor: 'transparent' },
})
// Auth Screen Navigation Setup
const AuthStack = createStackNavigator({
  SignUp: SignUpScreen,
  Auth: AuthScreen,
},{ 
    initialRouteName: 'Auth',
    headerMode: 'none',
    cardStyle: { shadowColor: 'transparent' },
})
const LandingStack = createStackNavigator({
  Landing: LandingScreen
},{
    initialRouteName: 'Landing',
    headerMode: 'none',
    cardStyle: { shadowColor: 'transparent' },
})

// Main App Navigation
const AppNav = createStackNavigator({
    TimeIn: TimeInScreen,
    TimeSheet: TimeSheet,
    Home: HomeScreen,
    Profile: ProfileScreen,
    Edit: EditProfile,
    AllAssignments: AllAssignmentsScreen,
    ShowDBs: ShowDBsScreen,
    NewDB: {
      screen: createMaterialTopTabNavigator({
        Natural: NewDBScreen,
        Assignment: AssignmentDBScreen
      }, {
          initialRouteName: "Natural",
          tabBarOptions: {
            style: {
              backgroundColor: colors.SECONDARY_BACKGROUND,
            },
            indicatorStyle: {
              backgroundColor: "white"
            }
          }
        }),
      navigationOptions: {
        title: 'New Drive By',
      }
    }
  },{ 
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.PRIMARY_BACKGROUND,
        opacity: 1,
        height: 80,
        ...ifIphoneX({
          height: 60
        }),
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        flex: 1,
        color: 'white',
        fontSize: 30,
        alignSelf: 'center',
      },
    },
})

// Renders the Main App navigator with the SlideMenu wrapped around it
class AppStack extends React.Component {
    // Have to explicitly pass in the AppStack's router, otherwise this will render a new Router when we render <AppStack/>
    // and won't be able to interact with the rest of the navigators in the switch nav
    static router = AppNav.router

    render() {
        return (
            <SlideMenu
                renderLeftView = {() => <LeftMenu navigation={this.props.navigation}/>}
                renderCenterView = {() => <AppNav navigation={this.props.navigation}/>}
            />
        )
    }
}



export default SwitchNav = createAppContainer(createSwitchNavigator({
    App: AppNav,
    Auth: AuthStack,
    Landing: LandingStack,
    Setup: SetupStack,
   // NewDB: NewDBStack
},{
    initialRouteName: 'Landing',
}, ))


