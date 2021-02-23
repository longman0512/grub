import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import { Avatar, Icon, Input } from "react-native-elements";
import global from "../../global";
import * as Progress from 'react-native-progress';
import Axios from "axios";
import MaterialTabs from 'react-native-material-tabs';
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';
export default class message extends Component {
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
    this.state = {
      data: [],
      names: [],
      progressPercent: 0.2,
      selectedTab: 0,
      users: []
    };
  }
  componentDidMount(){
    this.getMessage()
  }
  getMessage=async ()=>{
    var data = new FormData();
    var unix = Math.round(+new Date()/1000);
    var timestamp = unix+"000";
    var data = new FormData();
    data.append("api_key", " admin@1474?");
    data.append("client_id", global.USER.details.client_info.client_id)
    data.append("client_flag", "self")

    await Axios.post('GetMessages', data, {
      progress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
            console.log(progressEvent.loaded + ' ' + progressEvent.total);
          //  this.updateProgressBarValue(progressEvent);
          this.setState({progressPercent: progressEvent.loaded/progressEvent.total})
        }
     }
    }).then(res=>{
      console.log(res.data.details.data, "details")
      var temp = {}
      this.setState({names: []})
      if(res.data.details.data)
      res.data.details.data.map((msg, index)=>{
        if(typeof temp[msg.trigger_info.first_name] == "undefined"){
          temp[msg.trigger_info.first_name] = []
          temp[msg.trigger_info.first_name].push(msg)
          this.setState({
            data: temp,
            names: [...this.state.names, msg.trigger_info.first_name]
          })
        } else {
          console.log("yes")
          // var obj = {};
          // obj[msg.trigger_info.first_name] = []
          // obj[msg.trigger_info.first_name].push(msg)
          // temp.push(obj)
          // var t = this.state.data
          // t[msg.trigger_info.first_name].push(msg
          // temp.push(msg)
          temp[msg.trigger_info.first_name].push(msg)
          console.log(temp)
          this.setState({
            data: temp,
            // names: [...this.state.names, msg.trigger_info.first_name]
          })
          // temp = t
        }
      })
      console.log(temp, "temp")
      this.setState({
        users: res.data.details.users,
        filtered: res.data.details.users,
        progressPercent: 0
      })
      console.log(res.data.details.users)
    }).catch(error=>{
      this.setState({
        progressPercent: 0
      })
    });
  }
  getUnreadMsg = (mem)=>{
    var num = 0;
    var total = 0
    // console.log(num, "numbers")
    // console.log(mem)
    mem.map((msg, index)=>{
      // console.log(msg.client_id)
      total++
      if(msg.client_id == global.USER.details.client_info.client_id && msg.is_read != 1 ){
      //   console.log("unread")
        num++
      }
    })
    console.log(total, num,  "number")
    if(num){
      return <Text style={styles.newText}>{num}</Text>
    }
  }

  handleSearch=(v)=>{
    console.log(v)
    var temp = []
    var str = v.toLowerCase()
    if(this.state.users.length)
    this.state.users.map((member, index)=>{
      if(member.first_name.toLowerCase().indexOf(str)>=0 ||member.last_name.toLowerCase().indexOf(str)>=0 ){
        temp.push(member)
      }
    })
    this.setState({filtered: temp})
  }
  goSendMessage =(value)=>{
    console.log(value)
    if(typeof this.state.data[value.first_name]!= "undefined"){
      console.log("have message")
      this.props.navigation.navigate("SendMessage", {
        msg: this.state.data[value.first_name],
        reload: this.getMessage
      })
    } else {
      console.log("no message")
      this.props.navigation.navigate("SendMessage", {
        msg: [{
          trigger_info: value
        }],
        reload: this.getMessage
      })
    }
  }
  render() {
    return (
      <View style={styles.bgContainer}>
      
      {this.state.progressPercent>0?
        <Progress.Bar 
        progress={this.state.progressPercent} 
        animated
        width={global.CONSTANT.WIDTH} />:null}
        
        <MaterialTabs
          items={['Messages', 'All Users']}
          selectedIndex={this.state.selectedTab}
          onChange={index => this.setState({ selectedTab: index })}
          style={{backgroundColor: global.COLOR.PRIMARY}}
          barColor={global.COLOR.PRIMARY}
        />
        {this.state.selectedTab==1&&<View>
          <Input
            placeholder="Search "
            placeholderTextColor="#000"
            inputContainerStyle={styles.inputFiedContainer}
            keyboardType="default"
            inputStyle={styles.inputTextSearch}
            onChangeText={v=>this.handleSearch(v)}
          />
        </View>}
        {this.state.selectedTab==0&&<FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={this.state.names}
          renderItem={({ item: d }) => (
            <TouchableOpacity 
              style={styles.rowContainer}
              onPress={()=>{
                console.log(this.state.data[d])
                this.props.navigation.navigate("SendMessage", {
                  msg: this.state.data[d],
                  reload: this.getMessage
                })
              }}
              >
              <View style={styles.avatarContainer}>
                {this.state.data[d][0].trigger_info.avatar?<Avatar rounded size={60} source={{ uri: "https://www.grubhouse.co.uk/upload/"+this.state.data[d][0].trigger_info.avatar }} />:<Avatar rounded size={60} title={this.state.data[d][0].trigger_info.first_name+this.state.data[d][0].trigger_info.last_name} />}
                <Text style={styles.nameText}>
                  {d}  
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <View style={styles.lastContainer}>
                  <Text>Last messageasss</Text>
                  <Text style={styles.dateText}>{this.state.data[d][0].date_created.substring(0, 10)}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  {this.getUnreadMsg(this.state.data[d])}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />}
        {this.state.selectedTab==1&&<FlatList
          ItemSeparatorComponent = { this.FlatListItemSeparator }
          showsVerticalScrollIndicator={false}
          data={this.state.filtered}
          renderItem={({ item: d }) => (
            <TouchableOpacity 
              style={{paddingLeft: 20, borderColor: "gray", borderBottomWidth: 1, paddingVertical: 5}}
              onPress={()=>{
                console.log(this.state.data[d])
                this.goSendMessage(d)
                
              }}
              >
              <View style={styles.avatarContainer}>
                {d.avatar?<Avatar rounded size={60} source={{ uri: "https://www.grubhouse.co.uk/upload/"+d.avatar }} />:<Avatar rounded size={60} title={d.first_name[0]+d.last_name[0]} />}
                <Text style={styles.nameText}>
                  {d.first_name + " "+d.last_name }
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <View style={styles.lastContainer}>
                  <Text>Last message</Text>
                  <Text style={styles.dateText}>{this.state.data[d][0].date_created.substring(0, 10)}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  {this.getUnreadMsg(this.state.data[d])}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dateText: {
    color: "gray",
    fontSize: 12
  },
  newText: {
    fontSize: 13,
    backgroundColor: "red",
    color: "white",
    borderRadius: 4,
    padding:3,
    width: 30,
    textAlign: "center"
  },
  lastContainer: {
    width: "60%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "space-around"
  },
  buttonContainer: {
    width: "20%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  nameText: {
    color: "black",
    fontSize: 18,
    marginLeft: 20
  },
  infoContainer: {
    width: "40%",
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  avatarContainer: {
    width: "40%",
    position: "relative",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  rowContainer: {
    height: 80,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 4,
    borderColor: "gray",
    borderBottomWidth: 1,
    backgroundColor: "white"
  },
  bgContainer: {
    flex: 1,
    width: null,
    backgroundColor: "#fff",
    justifyContent: "center"
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
  },
  inputFiedContainer: {
    borderWidth: 1,
    borderColor: "gray",
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.03)",
    width: "100%"
    // marginTop: global.CONSTANT.STATUSBAR + 20
  },
  inputTextSearch: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    marginVertical: 6,
    marginHorizontal: 16
  },
});
