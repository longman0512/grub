import React, { Component } from "react";
import { 
  Text, 
  StyleSheet, 
  TextInput, 
  View, 
  Dimensions, 
  TouchableOpacity, 
  FlatList, 
  Keyboard, 
  SafeAreaView 
} from "react-native";
import { Avatar, Icon, Input } from "react-native-elements";
import global from "../../global";
import * as Progress from 'react-native-progress';
import Axios from "axios";
import { getPushNotificationPermissions, registerForPushNotificationsAsync, sendNotification } from "../../utils/NotificationApi";
import ProgressCircle from 'react-native-progress-circle'
import FontAwesomeSpin from "../../components/Spin.js"
import { getNearBy, gerMerchantMenu, ReadMsg } from "../../utils/Api";
import parse from "../../utils/parse";
import stringify from "../../utils/stringify";
import { Platform } from "react-native";

export default class sendMessage extends Component {
  static navigationOptions = {
    title: "MESSAGES",
    headerStyle: {
      backgroundColor: "#fff"
    },

    headerTintColor: "#000",

    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  constructor(props) {
    super(props);
    this.flagList = ""
    this.state = {
      messages: this.props.navigation.state.params.msg,
      msg: "",
      progressPercent: 0,
      progressFlag: false,
      keyboardSpace: 0
    };
  }
  componentDidMount(){
    // this.getMessage()
    if(Platform.OS == "ios"){
      const showEvt = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
      Keyboard.addListener(showEvt, this.updateKeyboardSpace);
      const hideEvt = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
      Keyboard.addListener(hideEvt, this.resetKeyboardSpace);
    }
    
  }
  componentWillUnmount(){
    if(Platform.OS == "ios"){
      const showEvt =  Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
      Keyboard.removeListener(showEvt, this.updateKeyboardSpace);
      const hideEvt =  Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
      Keyboard.removeListener(hideEvt, this.resetKeyboardSpace);
    }
    
  }
  updateKeyboardSpace = (event)=>{
    const screenHeight = Dimensions.get('window').height;
    const newKeyboardSpace = screenHeight - event.endCoordinates.screenY;
    console.log(newKeyboardSpace)
    this.setState({keyboardSpace: newKeyboardSpace})
  }
  resetKeyboardSpace = ()=>{
    this.setState({keyboardSpace: 0})
    console.log(0)
  }
  read=(d)=>{
   
    if(d.trigger_id != global.USER.details.client_info.client_id){
      console.log("read")
      ReadMsg(d.id).then(async res=>{
        var data = new FormData();
        data.append("api_key", " admin@1474?");
        data.append("client_id", global.USER.details.client_info.client_id)
        data.append("trigger_id", d.trigger_info.client_id)
        await Axios.post('GetMSGById', data).then(res=>{
          this.setState({
            messages: res.data.details.data,
            progressPercent: 0,
            progressFlag: false,
            msg: ""
          })
          
          this.props.navigation.state.params.reload()
        }).catch(error=>{
          this.setState({
            progressPercent: 0,
            progressFlag: false,
            msg: ""
          })
          
          this.props.navigation.state.params.reload()
        });
      })
    }
  }
  tsendMessage = ()=>{
    this.setState({progressFlag: true})
    console.log(this.state.messages)

    var client = this.state.messages[0].trigger_info
    console.log(client.client_id, client.expo_token)
    sendNotification(
    client.expo_token, 
    {
      title: "Message",
      body: this.state.msg,
    }, 
    
    {
      client_id: client.client_id,
      first_name: client.first_name
    }).then(async res=>{
    //  this.props.navigation.state.params.reload() 

      var data = new FormData();
      data.append("api_key", " admin@1474?");
      data.append("client_id", global.USER.details.client_info.client_id)
      data.append("trigger_id", client.client_id)
      await Axios.post('GetMSGById', data, {
        progress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
              console.log(progressEvent.loaded + ' ' + progressEvent.total);
            //  this.updateProgressBarValue(progressEvent);
            this.setState({progressPercent: progressEvent.loaded/progressEvent.total})
          }
       }
      }).then(res=>{
        this.setState({
          messages: res.data.details.data,
          progressPercent: 0,
          progressFlag: false,
          msg: ""
        })
        
        this.props.navigation.state.params.reload()
      }).catch(error=>{
        this.setState({
          progressPercent: 0,
          progressFlag: false,
          msg: ""
        })
        
        this.props.navigation.state.params.reload()
      });
    
    })
  }
  render() {
    return (
      <SafeAreaView style={styles.bgContainer}>
        <FlatList
          inverted
          ref = {ref=>{this.flagList = ref}}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={this.state.messages}
          style={{width: "100%", paddingHorizontal: 10}}
          renderItem={({ item: d }) => (
              <TouchableOpacity 
                style={d.client_id != global.USER.details.client_info.client_id?styles.ownerContainer:styles.friendContainer}
                onPress={()=>{
                  this.read(d)
                }}
                >
                <View style={styles.ownerMsg}>
                  <Text style={{paddingLeft: 20, fontSize: 10}}>{d.date_created}</Text>
                  <View style={d.client_id != global.USER.details.client_info.client_id?styles.ownerMsgContainer:styles.friendMsgContainer}>
                    <Text style={styles.message}>{parse(d.push_message)}</Text>
                    <View style={{alignSelf: "flex-end", flexDirection: "row"}}>
                      {/* <Text>state: </Text> */}
                      <Icon 
                        name="check"
                        // reverse
                        color="white"
                        type="material-community"
                        size={15}
                        iconStyle={styles.icon1}
                        Component={TouchableOpacity}
                      />
                      {
                        d.is_read!=1?null:
                        <Icon 
                        name="check"
                        // reverse
                        color="white"
                        type="material-community"
                        size={15}
                        iconStyle={styles.icon1}
                        Component={TouchableOpacity}
                      />
                      }
                      
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
          )}
        />
        <View 
          style={{
            borderColor: "gray",
            borderTopWidth: 1,
            height: 55,
            width: "100%",
            borderRadius: 5,
            backgroundColor: "white",
            color: "#fff",
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            marginBottom: this.state.keyboardSpace
          }}>
          <View style={{
            borderRadius: 30, 
            borderColor: "#fff",
            borderWidth: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: 'center',
            width: 30,
            height: 30,
            backgroundColor: "white"
          }}>
              <Icon 
                name="message-text-outline"
                // reverse
                color={global.COLOR.PRIMARY}
                type="material-community"
                size={25}
                iconStyle={styles.icon1}
                Component={TouchableOpacity}
                // onPress={this.tsendMessage}
              />
          </View>
          <View 
            style={{width: "90%"}}>
            <TextInput 
              placeholder='Start typing...'
              onChangeText={(v) => {
                this.setState({ msg: v}) 
              }}
              style={styles.inputText}
              value={this.state.msg}
            />
            
          </View>
          <View style={{
            borderRadius: 30, 
            borderColor: "#fff",
            borderWidth: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: 'center',
            width: 30,
            height: 30,
            backgroundColor: "white"
          }}>
            {this.state.progressFlag?
              <FontAwesomeSpin 
              color="blue"
              style={{ fontSize: 32 }}>
              <Icon
                name="rotate-right"
                type="material-community"
                size={22}
                color={global.COLOR.PRIMARY}
                style={styles.loadingIcon}
              />
            </FontAwesomeSpin>:<Icon 
                name="send"
                // reverse
                color={global.COLOR.PRIMARY}
                type="material-community"
                size={25}
                iconStyle={styles.icon1}
                Component={TouchableOpacity}
                onPress={this.tsendMessage}
              />
            
            }
              
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  inputText: {
    width: "90%",
    marginLeft: 20,
    color: "black",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    height: 40,
    alignItems: "flex-start",
    textAlignVertical: "center",
    padding: 5,
    backgroundColor: "#d3d3d3"
  },
  addCommentField:{
    borderColor: "gray",
    borderTopWidth: 1,
    height: 55,
    width: "100%",
    borderRadius: 5,
    backgroundColor: "white",
    color: "#fff",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  message: {
    color: "white",
    fontSize: 15
  },
  sendStatus: {
    color: "gray",
    fontSize: 12,
    // width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  ownerContainer: {
    alignSelf: "flex-end"
  },
  friendContainer: {
    alignSelf: "flex-start"
  },
  ownerMsgContainer: {
    backgroundColor: global.COLOR.PRIMARY,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: "flex-end"
  },
  friendMsgContainer: {
    backgroundColor: "gray",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: "flex-start"
  },
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  orderContainer: {
    backgroundColor: global.COLOR.PRIMARY,
    height: 40,
    width: 156,
    borderRadius: 10,
    // marginBottom: 6,
    marginTop: 10
  },
  borderBackContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  text: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    color: "#fff"
  }
});