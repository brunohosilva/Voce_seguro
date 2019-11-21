// import React, { Component } from 'react';
// import { Platform, Text, View, StyleSheet, SafeAreaView } from 'react-native';
// import Modal from "react-native-modal";
// import { Icon, Button } from 'react-native-elements';
// import Constants from 'expo-constants';
// import * as Location from 'expo-location';
// import * as Permissions from 'expo-permissions';
// import MapView from 'react-native-maps';
// import type { Region } from 'react-native-maps';
// import axios from 'axios';

// type Props = {};
// type State = { region: ?Region, }

// export default class App extends Component {

//   render() {
//     
//     return (
//       <View style={styles.container}>

//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   btnShowInfo: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: 10,
//     padding: 5,
//     height: 50,
//     width: 50,
//     borderRadius: 400,
//     backgroundColor: '#FFFFFF',
//     borderColor: '#ddd',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//   },
//   btnChangeLayer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: 10,
//     left: 30,
//     padding: 5,
//     height: 50,
//     width: 50,
//     borderRadius: 400,
//     backgroundColor: '#FFFFFF',
//     borderColor: '#ddd',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//   },
//   btnShowCurrentLocation: {
//     justifyContent: 'center',
//     position: 'absolute',
//     bottom: 10,
//     right: 30,
//     padding: 5,
//     height: 50,
//     width: 50,
//     borderRadius: 400,
//     backgroundColor: '#FFFFFF',
//     borderColor: '#ddd',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//   },
//   btnCloseModal: {
//     position: 'absolute',
//     right: 0
//   },
//   info: {
//     color: '#FFFFFF',
//     textAlign: 'center',
//     position: 'absolute',
//     bottom: '50%',
//     padding: 30

//   }
// });

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Drawer, Container, Header, Content, Button } from 'native-base';
import MapView from 'react-native-maps';
import Modal from "react-native-modal";
import axios from 'axios';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Region } from 'react-native-maps';

type Props = {};
type State = { region: ?Region, }

class SideBar extends Component {


  render() {

    return (
      <View style={[styles.container, { backgroundColor: '#fff' }]}>
        <Text>
          <Icon name="rocket" size={30} color="#900" />
          Conteúdo side bar
                        </Text>
      </View>
    );
  }
};
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,' +
    'Shake or press menu button for dev menu',
});
export default class App extends Component<{}> {

  constructor(props: Props) {
    super(props);
    this.state = { region: null };
  }
  state = {
    location: null,
    errorMessage: null,
    isModalVisible: false
  };

  location = []

  componentDidMount() {
    // current ip network that are you use // 
    axios.get('http://192.168.3.128:3000/latlonCarSteal')
      .then(res => {
        this.location = res.data;
      })
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  switchMapType = () => {
    this.setState({ mapType: this.state.mapType === 'satellite' ? 'standard' : 'satellite' });
  }

  current_Location = () => {
    const mystate = {
      latitude: parseFloat(this.state.location.coords.latitude),
      longitude: parseFloat(this.state.location.coords.longitude),
      longitudeDelta: 0.04,
      latitudeDelta: 0.04
    }
  }
  // criar função pra mostrar a posicão atual  quando clicar
  showCurrentLocation = () =>{
    this.setState({
      region: this.current_Location()
    });
  } 

  closeDrawer = () => {
    this.drawer._root.close()
  };
  openDrawer = () => {
    this.drawer._root.open()
  };
  render() {
    let latitude = 0;
    let longitude = 0;

    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      latitude = parseFloat(this.state.location.coords.latitude);
      longitude = parseFloat(this.state.location.coords.longitude);
    }

    return (
      <Drawer
        ref={(ref) => { this.drawer = ref; }}
        content={<SideBar navigator={this.navigator} />}
        onClose={() => this.closeDrawer()}>
        <Container>
          <Header style={styles.header}>
            <Container style={styles.container_menu}>
              <Icon onPress={() => this.openDrawer()} name="bars" size={30} style={styles.menu} />
            </Container>
          </Header>
          <View style={styles.container}>
            <MapView
              style={styles.mapStyle}
              mapType={this.state.mapType}
              region={{
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
              }}
            >

              <MapView.Marker
                coordinate={{
                  latitude: latitude,
                  longitude: longitude
                }}
                title={"Minha Localização"}
                description={"Estou aqui"}
                image={require('./icon/currentlocation2.png')}
              />
              {this.location.map((marker, id) => (
                <MapView.Marker
                  key={id}
                  coordinate={marker.coordinates}
                  title={marker.title}
                  image={require('./icon/stolecarmin.png')}
                />
              ))}
            </MapView>
            <TouchableOpacity style={styles.btnShowInfo}>
              <Icon
                name='info-circle'
                type='font-awesome'
                onPress={this.toggleModal} />
              <Modal isVisible={this.state.isModalVisible}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.info}>No último mês foram relatados 20.999 furtos de carros</Text>
                  <Button style={styles.btnCloseModal}
                    icon={{
                      name: 'times-circle',
                      type: 'font-awesome',
                      color: '#FFFFFF'
                    }}
                    type="clear"
                    onPress={this.toggleModal}
                  />
                </View>
              </Modal>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnChangeLayer}>
              <Icon
                name='map'
                type='font-awesome'
                onPress={this.switchMapType} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnShowCurrentLocation}
            onPress={this.showCurrentLocation}>
              <Icon
                name='location-arrow'
                type='font-awesome'
                 />
            </TouchableOpacity>
          </View>

        </Container>
      </Drawer>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  btnShowInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    padding: 5,
    height: 50,
    width: 50,
    borderRadius: 400,
    backgroundColor: '#FFFFFF',
    borderColor: '#ddd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
  },
  btnChangeLayer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 30,
    padding: 5,
    height: 50,
    width: 50,
    borderRadius: 400,
    backgroundColor: '#FFFFFF',
    borderColor: '#ddd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
  },
  btnShowCurrentLocation: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 30,
    padding: 5,
    height: 50,
    width: 50,
    borderRadius: 400,
    backgroundColor: '#FFFFFF',
    borderColor: '#ddd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
  },
  btnCloseModal: {
    right: 0,
    // ver o botão de fechar
  },
  info: {
    color: '#FFFFFF',
    textAlign: 'center',
    position: 'absolute',
    bottom: '50%',
    padding: 30

  },
  menu: {
    color:'#ffffff',
    marginTop : 7
  },
  container_menu: {
    backgroundColor:'#1E90FF',
    width: Dimensions.get('window').width,
  },
  header: {
    backgroundColor:'#1E90FF',
  }
});