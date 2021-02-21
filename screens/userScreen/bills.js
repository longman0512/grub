import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { Icon, Divider, Avatar, Button } from "react-native-elements";
import global from "../../global";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { Card } from 'react-native-shadow-cards';
import { ScrollView } from "react-native-gesture-handler";
import { PayNow } from "../../utils/Api"
// const paypal = require('@paypal/checkout-server-sdk');

export default class bills extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });
  constructor(props) {
    super(props);
    this.selectedPayment = 0
    this.state = {
      selectedPayment: 0
    }
  }
  pay = (value)=>{
    console.log(paypal)
    // PayPal.initialize(PayPal.SANDBOX, "AdU1PQAOmLiaQm9wewajRsHsXdbLuxREBWVq1c11mPVSKdnj8xd_t9MJup1u4BJ6SidGADAxTsCAKtaB");
    // PayPal.pay({
    //   price: '40.70',
    //   currency: 'GBP',
    //   description: 'Your description goes here',
    // }).then(confirm => console.log(confirm))
    //   .catch(error => console.log(error));
    // PayNow(this.props.navigation.state.params.allData, value).then(res=>{
    //   console.log(res.data, "bill results")
    // })
  }
  render() {
    return (
      // background container
      <View style={styles.bgContainer}>
        <ScrollView
          style={{textAlign: "CENTER"}}
        >
        <View style={{marginTop: global.CONSTANT.STATUSBAR + 5, height: 50, flexDirection:  'row', alignItems: "center"}}>
          <Image
            source={global.ASSETS.DELIVERY}
            style={{marginHorizontal: 20, width: 50, height: 50, resizeMode: "cover"}}
          />
          <Text style={{fontSize: 20, fontWeight: "bold"}}>Deliver in 20-35min</Text>
        </View>
        <MapView
          ref={(ref)=>{this.mapRef = ref}}
          showsMyLocationButton
          style={{ height:240, width: global.CONSTANT.WIDTH, marginVertical: 10 }}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: this.props.navigation.state.params.allData.delivery_at.latitude,
            longitude: this.props.navigation.state.params.allData.delivery_at.longitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0121,
          }}
          // onLayout = {() =>{ 
          //   this.mapRef.fitToCoordinates(this.myLatLongs, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: true })}}
        >
          <Marker
            coordinate={{
              latitude: this.props.navigation.state.params.allData.delivery_at.latitude,
              longitude: this.props.navigation.state.params.allData.delivery_at.longitude,
            }}
            Component={TouchableOpacity}
            anchor={{ x: 0.5, y: 0.9 }}
          >
            <Icon
              name="map-marker-radius"
              type="material-community"
              size={24}
              color="black"
              style={styles.mapMarker}
            />
          </Marker>
        </MapView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 10,
            marginVertical: 5,
            height: 30,
            marginRight: 50,
            marginBottom: 30,
          }}
        >
          <View style={{width: "20%", height: 30, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
            <Icon
              name="home-outline"
              color="#013220"
              type="material-community"
              size={25}
              // iconStyle={styles.icon}
            />
          </View>
          <TouchableOpacity style={{width: "80%"}}
          >
            <Text style={{fontSize: 16}}>{this.props.navigation.state.params.allData.to}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{width: "10%"}}
            >
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 10,
            marginVertical: 5,
            height: 30,
            marginRight: 50,
            marginBottom: 30,
          }}
        >
          <View style={{width: "20%", height: 30, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
            <Icon
              name="clipboard-outline"
              color="#013220"
              type="material-community"
              size={25}
              // iconStyle={styles.icon}
            />
          </View>
          <TouchableOpacity style={{width: "80%"}}
          >
            <Text style={{fontSize: 16}}>{this.props.navigation.state.params.allData.delivery_instruction}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{width: "10%"}}
            >
            <Icon
              name="chevron-right"
              color="gray"
              type="material-community"
              size={24}
              // iconStyle={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 10,
            marginVertical: 5,
            height: 30,
            marginRight: 50,
            marginBottom: 30,
          }}
        >
          <View style={{width: "40%", height: 30, flexDirection: "row", alignItems: "center", marginLeft: 20}}>
            <Text style={{fontSize: 20, fontWeight: "bold"}}>Payment</Text>
          </View>
          <TouchableOpacity style={{width: "35%"}}
          >
            {/* <Text style={{fontSize: 16}}>Please call when you arrive!!!</Text> */}
          </TouchableOpacity>
          <TouchableOpacity style={{width: "25%", flexDirection: "row", justifyContent: "flex-end"}}
            >
            <Text style={{fontSize: 15, color: "gray"}}>change</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginHorizontal: 10,
            marginVertical: 5,
            marginRight: 30,
            marginBottom: 30,
            width: "93%"
          }}
        >
          <TouchableOpacity
            onPress={()=>{
              this.setState({selectedPayment : 0})
              console.log("paypal")
            }}
            style={styles.cardContainer}
          >
            <Card
              style={styles.innerCard}
            >
            
              <Image
                source={global.ASSETS.PAYPAL}
                style={{width: 30, height: 30, resizeMode: "cover"}}
              />
              <Text style={{fontSize: 15, color: "gray", textAlign: "center"}}>PayPal</Text>
              {this.state.selectedPayment == 0&&<Icon
                name="checkbox-marked-circle-outline"
                type="material-community"
                size={24}
                color="black"
                style={styles.mapMarker}
              />}
            </Card>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={()=>{
              this.setState({selectedPayment : 1})
              console.log("apple")
            }}
            style={styles.cardContainer}
          >
            <Card
              style={styles.innerCard}
            >
            
              <Image
                source={global.ASSETS.APPLE}
                style={{width: 30, height: 30, resizeMode: "cover"}}
              />
              <Text style={{fontSize: 15, color: "gray", textAlign: "center"}}>Apple Pay</Text>
              {this.state.selectedPayment == 1&&<Icon
                name="checkbox-marked-circle-outline"
                type="material-community"
                size={24}
                color="black"
                style={styles.mapMarker}
              />}
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{
              this.setState({selectedPayment : 2})
              console.log("card")
            }}
            style={styles.cardContainer}
          >
            <Card
              style={styles.innerCard}
            >
            
              <Image
                source={global.ASSETS.CARD}
                style={{width: 30, height: 30, resizeMode: "cover"}}
              />
              <Text style={{fontSize: 15, color: "gray", textAlign: "center"}}>Cash or Card</Text>
              {this.state.selectedPayment == 2&&<Icon
                name="checkbox-marked-circle-outline"
                type="material-community"
                size={24}
                color="black"
                style={styles.mapMarker}
              />}
            </Card>
          </TouchableOpacity>
          
        </View>
        
        <Button
          onPress={() =>{
            var payment_type = ""
            switch(this.state.selectedPayment){
              case 0:
                payment_type = "paypal"
                break;
              case 1:
                payment_type = "apple"
                break;
              case 2:
                payment_type = "card"
                break;
            }
            this.pay(payment_type)
          }}

          containerStyle={{marginHorizontal: 20, marginBottom: 20}}
          title={"Pay"}
        />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  innerCard: {
    width: "100%", 
    height: "100%", 
    flexDirection: "column", 
    justifyContent: "center", 
    alignItems: "center"
  },
  cardContainer: {
    width: "30%", 
    height: 100, 
    flexDirection: "column", 
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff"
  },
  billContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 20
  },
  billText: {
    fontSize: 16,
    // fontWeight: "bold",
    color: "gray"
  },
  yourBillContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 30
  },
  grubText: {
    fontWeight: "bold",
    fontSize: 16
  },
  memberText: {
    color: "gray"
  },
  grubContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 45,
    marginTop: 50
  },
  icon: {
    marginVertical: 10
  },
  divider: {
    height: 1,

    backgroundColor: global.COLOR.PRIMARY,
    marginHorizontal: 30,
    marginTop: 16
  },
  orderContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 30,
    marginTop: 24
  },
  itemsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 38
  },
  leftText: {
    fontSize: 14,
    marginHorizontal: 5,
    marginTop: 6
  },
  avatarContainetr: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 38,
    marginTop: 30
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  nameText: {
    // margin: 10,
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 4,
    marginHorizontal: 16
  },
  paidText: {
    marginTop: 5,
    color: "gray"
  }
});
