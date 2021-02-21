import React, { Component } from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { Input, Icon } from "react-native-elements";
import global from "../../global";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import Restaurant from "../../screens/userScreen/restaurantScreen";
import Dish from "../../screens/userScreen/dishScreen";
import { Platform } from "react-native";

export default class combo extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  });
  constructor(props) {
    super(props);
    this.state = {
      search_type: "",
      searchName:'',
      searchResult: []
    };
  }
  componentDidMount(){
    this.setState({
      searchName: this.props.navigation.state.params.selectedCuisineName,
      searchResult: this.props.navigation.state.params.searchResult
    })
    // console.log("search result in combo", this.props.navigation.state.params.searchResult)
  }
  render() {
    return (
      // background containe
      <View style={styles.bgContainer}>
        {/* input container */}
        <View style={styles.pizzaContainer}>
          <Text style={styles.pizzaText}>{this.props.navigation.state.params.selectedCuisineName}</Text>
          {/* <Input
            placeholder="Search by Address"
            placeholderTextColor="gray"
            inputContainerStyle={styles.inputFiedContainer}
            keyboardType="default"
            inputStyle={styles.inputText}
          /> */}
        </View>
        {/* <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.sortView}>
              <Text style={styles.sortText}>Sort</Text>
            </View>
            <View style={styles.sortView}>
              <Text style={styles.sortText}>Price Range </Text>
            </View>
            <View style={styles.sortView}>
              <Text style={styles.sortText}>Dietary</Text>
            </View>
            <View style={styles.sortView}>
              <Text style={styles.sortText}>Rating</Text>
            </View>
            <View style={styles.sortView}>
              <Text style={styles.sortText}>Hygiene</Text>
            </View>
            <View style={styles.sortView}>
              <Text style={styles.sortText}>Delivery</Text>
            </View>
          </ScrollView>
        </View> */}
        <Text style={styles.restaurantText}>Restaurants</Text>
        {/* scrollable tab view container */}
         <ScrollableTabView
          style={styles.tabContainer}
          // tabBarBackgroundColor="green"
          tabBarActiveTextColor="#000"
          tabBarInactiveTextColor="gray"
          tabBarTextStyle={{ fontSize: 22, fontWeight: "bold" }}
          tabBarUnderlineStyle={{ backgroundColor: "FFF" }}
          initialPage={0}
          // locked={true}
        >
        <Restaurant
          // tabLabel="Restaurants"
          navigation={this.props.navigation}
          originalRestData = {this.props.navigation.state.params.restData}
          restData = {this.props.navigation.state.params.restData}
          cuisineList= {this.props.navigation.state.params.cuisineData}

        />
        {/* <Dish tabLabel="Dishes" 
          navigation={this.props.navigation} 
        /> */}
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff",
  },
  inputText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "gray",
    marginHorizontal: 6,
    // margin: 6
  },
  inputFiedContainer: {
    borderWidth: 1,
    borderColor: "gray",
    marginTop: global.CONSTANT.STATUSBAR + 20,
    borderRadius: 20,
    // marginLeft: 30
    // marginTop: global.CONSTANT.STATUSBAR + 20
  },
  tabContainer: {
    marginTop: -50,
  },
  restaurantText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  pizzaText: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
  },
  pizzaContainer: {
    marginTop: Platform.OS=="ios"?(global.CONSTANT.STATUSBAR + 20):20,
    // height: 50,
    width: 500,
    borderColor: "gray",
    // borderWidth: 1,
    alignSelf: "center",
  },
  sortView: {
    backgroundColor: "#ededed",
    borderRadius: 8,
    marginLeft: 10,
    // marginTop: 10,
    marginBottom: 10,
  },
  sortText: {
    marginHorizontal: 10,
    marginVertical: 5,
    fontSize: 18,
  },
});
