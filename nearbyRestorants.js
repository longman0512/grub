import React, { Component, version } from "react";
import Toast from '@rimiti/react-native-toastify';
import axios from 'axios';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
  Animated,
  Dimensions ,
  ActivityIndicator
} from "react-native";
import {
  Button
} from "react-native-elements";
import FontAwesomeSpin from "../../components/Spin.js"
import MapView, { Marker } from "react-native-maps";
import global from "../../global";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { Icon } from "react-native-elements";

export default class nearbyRestorants extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
    footer: null,
  });
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      markerAnimation:new Animated.Value(0),
      data: [],
      latitude: 0.0,
      longitude: 0.0,
      nearbyList: [],
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      currentLocation: null,
      isSearching: false,
      offset: 0,
      mapHeight: 100,
      currentCoords:{
        lat: 0,
        lng: 0
      },
      coordTemp:{
        lat:0,
        lng: 0
      },
      loadingText:"",
      isChanging: false
    };
  }
  componentDidMount(){
    this._getLocationAsync()
  }
  _getLocationAsync = async () => {

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied",
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      coordTemp:{
        lat: location.coords.latitude,
        lng: location.coords.longitude
      }
    })
    this.getRests({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    })
  }

  getRests=async (location)=>{ 
    this.setState({
      latitude: location.latitude,
      longitude: location.longitude,
      isSearching: true,
      currentCoords:{
        lat: location.latitude,
        lng: location.longitude
      }
    });
    console.log("search area ", location)
    let address = await Location.reverseGeocodeAsync(location);
    console.log("searched city", address)
    let data = []

    // console.log("current location", address)
    this.setState({currentLocation: address.length?address[0].city:"Unknown"})
    // axios.get('https://www.grubhouse.co.uk/store/nearby?city='+address[0].city)
    // axios.get('https://www.grubhouse.co.uk/store/nearby?city=london')
    // .then(response=>{
    //     response.data.map(async (rest, index)=>{
    //       data.push({
    //         id: index+1,
    //         name: rest.restaurant_name,
    //         address: rest.street,
    //         image: "https://www.grubhouse.co.uk/upload/"+rest.logo,
    //         rating: 8.8,
    //         price_level: 4,
    //         open_time: "5:00am",
    //         close_time: "10:00pm",
    //         distance: this.getDistance({
    //           lat:rest.latitude?rest.latitude:0,
    //           lng:rest.lontitude?rest.lontitude:0
    //         }),
    //         lat: rest.latitude?rest.latitude:0,
    //         lng: rest.lontitude?rest.lontitude:0
    //     })
    //   })
    //     this.setState({nearbyList: data})
    // });

    await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+location.latitude+','+location.longitude+'&radius=4000&type=restaurant&key=AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0')
    // await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=0,0&radius=4000&type=restaurant&key=AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0')
         .then(response => {
            // console.log("response data", response)
        response.data.results.map(async (rest, index)=>{
              data.push({
                id: index+1,
                name: rest.name,
                address: rest.vicinity,
                image: "https://maps.googleapis.com/maps/api/place/photo?photoreference="+rest.photos[0].photo_reference+"&maxheight=200&key=AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0",
                rating: rest.rating,
                price_level: rest.price_level,
                open_time: "5:00am",
                close_time: "10:00pm",
                distance: this.getDistance(rest.geometry.location),
                lat: rest.geometry.location.lat,
                lng: rest.geometry.location.lng
              })
            })
         })
    this.setState({nearbyList: data, isSearching: false, mapHeight: 50})
    Animated.timing(
      this.state.markerAnimation,
      {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
      }
    ).start();
    console.log("current location", address)
}
  searchArea=async()=>{
    this.setState({isChanging: false})
    let location = this.refs.mapView.__lastRegion
    console.log("currentRegion", location)
    this.getRests({
      latitude: location.latitude,
      longitude: location.longitude
    })
  }
  changeLocation=(value)=>{
    this.setState({currentLocation: value})
    console.log(this.state.currentLocation)
  }
  setLocation=async ()=>{
    Keyboard.dismiss()
    // if(!this.state.currentLocation){
    //   return false
    // }
    // console.log("city name to change", this.state.currentLocation)
    // let cLocation = await Location.geocodeAsync(this.state.currentLocation)
    // console.log("changed city", cLocation)
    // if(cLocation.length == 0){
    //   Toast.show({
    //     type: 'error',
    //     position: 'bottom',
    //     text1: 'Warning',
    //     text2: 'Address is invalid',
    //     visibilityTime: 2000,
    //     autoHide: true,
    //   });
    // } else {
    //   this.getRests({
    //     latitude: cLocation[0].latitude,
    //     longitude: cLocation[0].longitude
    //   })
    // }
    this.setState({isChanging: true, mapHeight: 100})
  }
  setCurrentLocation=()=>{
    if(this.state.isSearching){
      return false
    } else {
      this.setState({
        latitude: this.state.coordTemp.lat,
        longitude: this.state.coordTemp.lng,
      })
    }
  }
  setDetaultZoom=()=>{
    let location = this.refs.mapView.__lastRegion
    this.setState({
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      latitude: location.latitude,
      longitude: location.longitude,
      mapHeight: 100
    })
  }
  rad = (x) => {
    return x * Math.PI / 180;
  };
  getDistance=(rest)=>{
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = this.rad(rest.lat - this.state.latitude);
    var dLong = this.rad(rest.lng - this.state.longitude);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(rest.lat)) * Math.cos(this.rad(rest.lat)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return (d/1000).toFixed(1)+"km"; // returns the distance in meter
  }

  viewScrolling=(v)=>{
    var currentOffset = v.nativeEvent.contentOffset.y;
    var direction = currentOffset > this.state.offset ? 'up' : 'down';
    var delta = Math.abs(currentOffset-this.state.offset)
    if(direction == "up"){
      console.log("scroll up")
      var currentMapHeight = this.state.mapHeight - delta
    } else {
      console.log("scroll down")
      var currentMapHeight = this.state.mapHeight + delta
    }
    this.setState({offset: currentOffset, mapHeight: currentMapHeight})
  }
  onMoveMap=()=>{
    this.setState({nearbyList: []})
  }
  render() {
    const screenHeight = Math.round(Dimensions.get('window').height);
    const mapViewHeight = this.state.scrollY.interpolate({
      inputRange: [0, 1000],
      outputRange: [this.state.mapHeight==100?screenHeight:screenHeight/2, 0],
      extrapolate: 'clamp'
    });
    const moveTo = this.state.markerAnimation.interpolate({inputRange: [0, 1], outputRange: [3, 0]});
    return (
      <View style={{ flex: 1, flexDirection:"column" }}>
        <View style={{flex:9, flexDirection: "column", justifyContent:"flex-end"}}>
        <Animated.View style={styles.mapContainer, {height: mapViewHeight}} ref="mapContainer">
          {/* map view container */}
          <MapView
            onPress={this.setDetaultZoom}
            showsMyLocationButton
            style={{ flex: 10, height: 250, width: global.CONSTANT.WIDTH, }}
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: this.state.latitudeDelta,
              longitudeDelta: 0.00521,
            }}
            ref="mapView"
          >
            {this.state.nearbyList.length>0?this.state.nearbyList.map((rest, index) => (
                <Marker
                  coordinate={{
                    latitude: rest.lat,
                    longitude: rest.lng
                  }}
                  image={global.ASSETS.MAP_MARKER}
                  title={rest.name}
                  Component={TouchableOpacity}
                ></Marker>
            )):null}
            <Icon
              name="map-marker"
              color="#000"
              type="material-community"
              size={35}
              iconStyle={styles.icon}
            />
            {this.state.isSearching?
            <Marker
              coordinate={{
                latitude: this.state.latitude,
                longitude: this.state.longitude
              }}
              style={{animated:false}}
              Component={TouchableOpacity}
              anchor={{x:0.5, y:0.5}}
            >
              <FontAwesomeSpin>
                <Image source={global.ASSETS.MAP_LOAD} style={{width:50,height:50}} />
              </FontAwesomeSpin>
            </Marker>:null}
          </MapView>
        </Animated.View>
        {/* // background container */}
        {this.state.isSearching?null:
        <ScrollView style={styles.bgContainer} ref="restList" 
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ])}>
          {/* Map container */}
          <TouchableOpacity
            activeOpacity={0.8}
            // onPress={()=>{this.props.navigation.navigate("nearby_maps")}}
            style={{backgroundColor: "transparent", zIndex:20}}
          />
          {/* bottom container */}
          <View style={styles.bottomContainer}>
            {/* nearby text container */}
            {this.state.nearbyList.length>0?
            <View>
            <Text style={styles.restaurantText}>NEARBY RESTAURANTS</Text>
            </View>:null}
            {/*  restaurant detail flatlis container */}
            <View style={styles.crispyFlatlist}>
              {/* flatlist */}
              {this.state.nearbyList.length>0?<FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.nearbyList}
                renderItem={({ item: d }) => (
                  <View
                    style={{
                      borderColor: "gray",
                      borderWidth: 0.2,
                      marginHorizontal: 10,
                      backgroundColor: "#fff",
                      marginBottom: 20,
                      borderRadius: 10,
                      position: "relative"
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate("Details")}
                    >
                      <Image source={{ uri: d.image}} style={styles.images} />
                      <View style={styles.timeContainer}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            backgroundColor: "rgba(0,0,0,0.3)",
                            // marginLeft: 6
                          }}
                        >
                          <View style={styles.greenContainer}>
                            <Text style={styles.openText}> Open </Text>
                          </View>
                          <Text style={styles.timeText}> {d.open_time}</Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            backgroundColor: "rgba(0,0,0,0.3)",
                          }}
                        >
                          <View style={styles.redContainer}>
                            <Text style={styles.openText}> Close </Text>
                          </View>
                          <Text style={styles.timeText}> {d.close_time} </Text>
                        </View>
                      </View>
                      <Text style={styles.missText}>{d.name}</Text>
                      <Text style={styles.addressText}>{d.address}</Text>
                      <View style={styles.amountContainer}>
                        <Text style={styles.amountText}>££&nbsp;{d.price_level}</Text>
                        <Text style={styles.amountText}>&nbsp;&nbsp;･&nbsp;&nbsp;</Text>
                        <Text style={styles.amountText}>{d.distance}</Text>
                        <Text style={styles.amountText}>
                        &nbsp;&nbsp;･&nbsp;&nbsp;
                        </Text>
                        <Text style={styles.amountText}>
                          <Icon
                            name="emoticon-happy-outline"
                            type="material-community"
                            size={22}
                            color="gray"
                            style={styles.loadingIcon}
                          />
                          &nbsp;
                        </Text>
                        <Text style={styles.amountText}>{d.rating}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              />:
                <View style={{height: "100%", backgroundColor: "#fff"}}>
                  <View style={{flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                    <View style={{}}>
                      <Image
                        style={{width: 40, height: 40, marginBottom: 5, marginTop: 30}}
                        source={global.ASSETS.ICON}
                      ></Image>
                    </View>
                    <View style={{width: "60%", marginBottom: 15}}>
                      <Text style={{fontSize: 17, textAlign:"center"}}>GRUB HOUSE</Text>
                    </View>
                    <View style={{width: "80%", marginBottom: 20}}>          
                      <Text style={{fontSize: 14, color:"#6599D9", textAlign:"center"}}>
                        Looks like GrubHouse hasn’t reached your area. Suggest your location for us to expand our platform further in the locations looking for our service.
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Button
                      title="Suggest a city"
                      // buttonStyle={styles.search}
                      titleStyle={styles.searchTitle}
                      type="outline"
                      Component={TouchableOpacity}
                      onPress={this.searchArea}
                    ></Button>
                  </View>
                </View>
              }
            </View>
          </View>
        </ScrollView>
        }
        {this.state.mapHeight == 100?
        <View style={styles.searchContainer}>
            {this.state.isSearching?null:
            <View style={styles.searchBtnContainer}>
              <Button
              title="Search this area"
              buttonStyle={styles.search}
              titleStyle={styles.searchTitle}
              type="outline"
              Component={TouchableOpacity}
              onPress={this.searchArea}
            ></Button>
            </View>
          }
          {this.state.isChanging?null:
          <View style={styles.currentLocContainer, {backgroundColor: "transparent"}}>
          <Button
            buttonStyle={styles.currentLocation}
            onPress={this.setCurrentLocation}
            icon ={
              <Icon
                name="navigation"
                color="#1A73E8"
                type="material-community"
                iconStyle={{backgroundColor: "#FFF", transform: [{ rotateZ: "45deg" }]}}
              />
            }
            type="outline"
            Component={TouchableOpacity}
          ></Button>
        </View>}
        </View>:null}
        </View>
        <View style={styles.locationChangeContainer}
        >
          {this.state.isSearching?
          <Text style={styles.changeText}>Loading...</Text>:this.state.isChanging?
          <Text style={styles.changeText}>Drag map to choose search area</Text>:[<Icon        
            name="map-marker"
            color="white"
            type="material-community"
            style={{marginTop: 5}}
            size={22}></Icon>,
          <TextInput
            style={styles.currentAddress}
            maxLength={40}
            onChangeText = {this.changeLocation}
            onEndEditing={this.changeLocation}
            placeholder="Insert City Name"
            // onKeyPress={}
            value={this.state.currentLocation}
          />]
        }
          <TouchableOpacity
               style={styles.changeText}
               onPress = {this.setLocation}>
                 {this.state.isSearching?
                 <FontAwesomeSpin style={{fontSize: 32}}>
                  <Icon
                    name="rotate-right"
                    type="material-community"
                    size={22}
                    color="#fff"
                    style={styles.loadingIcon}
                  />
                </FontAwesomeSpin>
                :this.state.isChanging?null:<Text style={styles.changeText}>Change</Text>}
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  selfLocation:{
    color: "grey"
  },
  loadingIcon: {
    color: "#fff",
  },
  searchContainer:{
    flexDirection: "row",
    zIndex: 2,
    justifyContent: "flex-end",
    paddingBottom: 4,
    position: "absolute",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  searchBtnContainer:{
    flex: 0.9,
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    margin: "auto",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  currentLocContainer:{
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
    margin: "auto",
    right: 4
  },
  currentLocation:{
    zIndex: 16,
    width: 50,
    backgroundColor: "#fff",
    right: 4,
  },
  searchTitle:{
    color: "#1A73E8",
  },  
  search:{
    backgroundColor: "#FFF",
    color: "white",
    width: 150,
    margin: "auto"
  },
  currentAddress:{
    color: "#FFF",
    width: 250,
  },
  locationChangeContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#6599D9",
    color: "#000",
    zIndex: 2
  },
  changeText: {
    color: "#fff",
    marginLeft: "auto",
    justifyContent: "flex-end",
  },
  bgContainer: {
    width: null,
    backgroundColor: "#fff",
    position: "relative",
    zIndex: 1,
    flexDirection:"column"
  },
  mapContainer: {
    zIndex: 1,
    position: "relative",
  },

  bottomContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  restaurantText: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
  images: {
    height: 200,
    marginBottom: 5,
    borderRadius: 10,
    resizeMode: "cover",
  },
  missText: {
    fontWeight: "bold",
    fontSize: 18,
    marginHorizontal: 10,
    marginTop: 10,
  },
  addressText: {
    fontSize: 20,
    marginHorizontal: 10,
    color: "gray",
    fontStyle: "italic",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "normal",
    marginHorizontal: 6,
    color: "#fff",
    alignSelf: "center",
  },
  amountText: {
    fontSize: 18,
    color: "gray",
  },
  icon: {
    marginTop: -250,
    alignSelf: "center",
  },
  crispyFlatlist: {
    flex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: 10,
    marginTop: -40,
  },
  openStatus:{
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 3,
    color: "#fff",
    backgroundColor: "green"
  },
  closeStatus:{
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 3,
    color: "#fff",
    backgroundColor: "red"
  },
  redContainer: {
    backgroundColor: "red",
    borderRadius: 5,
    width: 70,
  },
  openText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 6,
    color: "#fff",
    marginVertical: 1,
    alignSelf: "center",
  },
  greenContainer: {
    backgroundColor: "green",
    borderRadius: 5,
    width: 70,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
    marginHorizontal: 10,
  },
  markerText: {
    color: "white",
    paddingTop: 4,
    paddingLeft: 10,
    fontWeight: "bold"
  }
});
