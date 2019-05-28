// Library Imports
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation'
import React from 'react';
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
import { colors } from './styles';

// Auth Screen Navigation Setup
const AuthStack = createStackNavigator({
  //Login: LoginScreen,
  SignUp: SignUpScreen,
  Auth: AuthScreen,
  NotVerified: NotVerifiedScreen
},{ 
    initialRouteName: 'SignUp',
    headerMode: 'none',
    cardStyle: { shadowColor: 'transparent' },
})
const LandingStack = createStackNavigator({
  Landing: LandingScreen
}, {
    initialRouteName: 'Landing',
    headerMode: 'none',
    cardStyle: { shadowColor: 'transparent' },
  })

// Main App Navigation
const AppNav = createStackNavigator({
    TimeIn: TimeInScreen,
    TimeSheet: TimeSheet,
    Home: HomeScreen,
    NewDB: NewDBScreen,
    Profile: ProfileScreen
},{ 
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.PRIMARY_BACKGROUND,
        opacity: 1,
        height: 80
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        flex: 1,
        color: 'white',
        fontSize: 30,
        alignSelf: 'center',
      },
    },
//    cardStyle: { shadowColor: 'transparent' },
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
    Landing: LandingStack
},{
    initialRouteName: 'Landing',
}))


