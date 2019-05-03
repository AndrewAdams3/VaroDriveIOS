import React from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import { Swiper } from 'react-native-awesome-viewpager'
import {images} from '../config/images'
import {colors} from '../config/styles'

export default class LoginSlide extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      scrollEnabled: true,
      screen: 1
    }
  }

  OnGetScreen = (position) => {
    return position
  }

  render() {
    return (
      <ImageBackground source={{ uri: images.background }} style={styles.background}>
      <Swiper
        ref='ViewPager'
        loop={true}
        autoplay={false}
        scrollEnabled={this.state.scrollEnabled}
        style={styles.container}
        indicator={false}
        onPageSelected={(e) => this.props.OnGetScreen(e.nativeEvent.position)}
        >
          <View style={styles.slideContainer}>
            <View style={styles.slideContentContainer}>
              <Text style={{alignContent:'center', color:'green', }}>Placeholder for news</Text>
            </View>
         </View>
          <View style={styles.slideContainer}>
            <View style={styles.slideContentContainer}>
              <Text style={{ alignContent: 'center', color: 'green', }}>Placeholder for updates</Text>
            </View>
          </View>
          <View style={styles.slideContainer}>
            <View style={styles.slideContentContainer}>
              <Text style={{ alignItems: 'center', color: 'green', }}>Placeholder for other stuffs</Text>
            </View>
          </View>
      </Swiper >
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    paddingTop: 0
  },
  background: {
    flex: 1,
  },
  slideContainer: {
    backgroundColor: 'transparent', 
    padding: 40, 
    paddingBottom: 200, 
    paddingTop: 70,
  },
  slideContentContainer: {
    borderWidth: 5,
    borderRadius: 20,
    borderColor: colors.SECONDARY_BACKGROUND,
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row'
  },
});