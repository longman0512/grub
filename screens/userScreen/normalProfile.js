import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Switch,
  Image,
  AsyncStorage
} from "react-native";
import { Avatar, Icon, Divider, Tooltip } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";
import global from "../../global";
import ImageOverlay from "react-native-image-overlay";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { ScrollView } from "react-native-gesture-handler";
import { FlatGrid } from "react-native-super-grid";
import RBSheet from "react-native-raw-bottom-sheet";
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';
import { Thumbnail } from 'react-native-thumbnail-video';
import { 
  uploadAvatar, 
  uploadBg, 
  addFoodCourt, 
  getFoodCourtMe, 
  getFCourtDetail, 
  getMyfavourite, 
  getSubInformation ,
  toggleNotification,
  getDetailInfomation,
} from "../../utils/Api"
import { Video } from 'expo-av';

export default class normalProfile extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.getPermissionAsync();
    this.toolTip = []
    this.state = {
      name: "lynda_xo",
      location: "London",
      favorite: [],
      followers: [],
      following: [],
      student_hide: true,
      profile_image: "",
      avatar: "https://www.grubhouse.co.uk/upload/"+global.USER.details.client_info.avatar,
      bgVisible: false,
      bgImage: "https://www.grubhouse.co.uk/upload/"+global.USER.details.client_info.bgImage,
      foodCourt: []
    };
  }
  
  // Get camera and files permissions
  getPermissionAsync = async () => {
    if (global.CONSTANT.DEVICETYPE == "ios") {
      // const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      const { status, permissions } = await Permissions.askAsync(
        Permissions.CAMERA,
        Permissions.CAMERA_ROLL
      );
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };
  toggleSwitch = (val) => {

    this.setState({
      switchValue: val,
    });
    toggleNotification(global.USER.details.client_info.client_id, val).then(res=>{
      this.setState({switchValue: res.details})
    })

  };
  // Toggle camera options
  chooseUpload = () => {
    this.setState({
      isVisible: !this.state.isVisible
    });
  };

  // this._pickImage("camera");
  // Image Picker function
  _pickImage = async v => {

    let option =
      v == "camera"
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;
    let field = this.state.field;
    let result = await option({
      quality: 0.2,
      allowsEditing: true
    });

    if (!result.cancelled) {
      // this.setState({
      //   avatar: result.uri
      // });
    }
    uploadAvatar(result.uri).then(res=>{
      this.setState({
        avatar: "https://www.grubhouse.co.uk/upload/"+res.details
      })
    })
    this.dialogHide()
    this.chooseUpload();
  };

  _pickImageFromLibrary=async()=>{
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.cancelled) {
      this.setState({
        avatar: result.uri
      });
      uploadAvatar(result.uri).then(res=>{
        console.log(res)
        this.setState({
          avatar: "https://www.grubhouse.co.uk/upload/"+res.details
        })
      })
    }
    this.dialogHide()
  }

  openBRsheet = ()=>{
    this.RBSheet.open();
  }

  dialogHide = ()=> {
    
    this.setState({visible: false, bgVisible: false})
  }
  componentDidMount(){
    getFoodCourtMe().then(res => {
      if (res.details.length > 0) {
        this.setState({ foodCourt: res.details })
        console.log(res.details, "34634563456")
      }
    })
    getSubInformation().then(res=>{
      console.log(res.details, "subinformation")
      this.setState({
        favorite:res.details.favorite,
        followers: res.details.follower,
        following: res.details.following,
        users: res.details.users,
        switchValue: res.details.notificationFlag[0].notification_flag=="1"?true:false
      })
    })
  }

  reload = ()=>{
    getFoodCourtMe().then(res => {
      if (res.details.length > 0) {
        this.setState({ foodCourt: res.details })
        console.log(res.details, "34634563456")
      }
    })
    getSubInformation().then(res=>{
      console.log(res.details, "subinformation")
      this.setState({
        favorite:res.details.favorite,
        followers: res.details.follower,
        following: res.details.following,
        users: res.details.users,
        switchValue: res.details.notificationFlag[0].notification_flag=="1"?true:false
      })
    })
  }

  _pickBgImageFromLibrary=async()=>{
    console.log("asdfasdfddsf")
    this.dialogHide()
    let result = await ImagePicker.launchImageLibraryAsync({
      // base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    
    if (!result.cancelled) {
      uploadBg(result.uri).then(res=>{
        this.setState({
          bgImage: "https://www.grubhouse.co.uk/upload/"+res.details
        })
      })
    }
    
  }

  _pickBgImage = async v => {
    this.dialogHide()
    let option =
      v == "camera"
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;
    let field = this.state.field;
    let result = await option({
      base64: true,
      quality: 0.2,
      allowsEditing: true
    });
    
    if (!result.cancelled) {
      uploadBg(result.uri).then(res=>{
        this.setState({
          bgImage: "https://www.grubhouse.co.uk/upload/"+res.details
        })
      })
    }
    
    // this.chooseUpload();
  };
  setDataFromFollowing=(data)=>{
    this.setState({
      followers: data.followers,
      following: data.following,
    })
  }

  
  render() {
    return (
      // back ground container
      <View style={styles.bgContainer}>
        <Dialog
          width={300}
          height={150}
          visible={this.state.visible}
          onTouchOutside={this.dialogHide}
          footer={
            <DialogFooter>
              <DialogButton
                text="Camera"
                onPress={()=>{this._pickImage("camera")}}
                textStyle={{fontSize:14, color: "black"}}
              >
              </DialogButton>
              <DialogButton
                text="Gallery"
                onPress={this._pickImageFromLibrary}
                textStyle={{fontSize:14, color: "black"}}
              >
              </DialogButton>
            </DialogFooter>
          }
        >
          <DialogContent
            style={{marginTop: 'auto', padding: 5}}
          >
            <Text
              style={{fontSize: 17, color: "blue"}}
            >Please select Camera or Gallery to get your picture</Text>
          </DialogContent>
        </Dialog>

        <Dialog
          width={300}
          height={150}
          visible={this.state.bgVisible}
          onTouchOutside={this.dialogHide}
          footer={
            <DialogFooter>
              <DialogButton
                text="Camera"
                onPress={()=>{this._pickBgImage("camera")}}
                textStyle={{fontSize:14, color: "black"}}
              >
              </DialogButton>
              <DialogButton
                text="Gallery"
                onPress={this._pickBgImageFromLibrary}
                textStyle={{fontSize:14, color: "black"}}
              >
              </DialogButton>
            </DialogFooter>
          }
        >
          <DialogContent
            style={{marginTop: 'auto', padding: 5}}
          >
            <Text
              style={{fontSize: 17, color: "blue"}}
            >Please select Camera or Gallery to get background image</Text>
          </DialogContent>
        </Dialog>
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={130}
          duration={250}
          customStyles={{
            container: {
              // justifyContent: "center",
              alignItems: "center"
            }
          }}
        >
          <View style={styles.rbSheetContainer}>
          <TouchableOpacity 
              style={styles.itemContainer}
              Component={TouchableOpacity}
            >
              <View style={styles.groupBtn}>
                <Icon 
                  name="camera"
                  // reverse
                  color="black"
                  type="material-community"
                  size={20}
                  iconStyle={styles.icon1}
                />
              </View>
              <View 
                style={{width: "80%"}}>
                <Text
                  onPress={()=>{
                    this.RBSheet.close()
                    this.setState({bgVisible:true})
                  }} 
                >
                  Change the background
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.itemContainer}
              Component={TouchableOpacity}
            >
              <View style={styles.groupBtn}>
                <Icon 
                  name="camera"
                  // reverse
                  color="black"
                  type="material-community"
                  size={20}
                  iconStyle={styles.icon1}
                />
              </View>
              <View 
                style={{width: "80%"}}>
                <Text
                  onPress={()=>{
                    this.RBSheet.close()
                    this.setState({visible:true})
                  }} 
                >
                  Select Profile Picture
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              Component={TouchableOpacity}
              style={styles.itemContainer}
              >
              <View style={styles.groupBtn}>
                <Icon 
                  name="image-album"
                  // reverse
                  color="black"
                  type="material-community"
                  size={20}
                  iconStyle={styles.icon1}
                />
              </View>
              <View 
                style={{width: "80%"}}
                Component={TouchableOpacity}>
                <Text
                  onPress={()=>{
                    this.RBSheet.close()
                    addFoodCourt()
                  }}
                >
                  Add to Food Court
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </RBSheet>
        <ScrollView>
          {/* image backgroun container */}
          <ImageBackground
            source={{uri: this.state.bgImage}}
            style={styles.imageContainer}
          >
            <View
              style={{
                backgroundColor: "rgba(0, 0, 0,0.1)"
              }}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name="email-outline"
                  reverse
                  reverseColor="gray"
                  color="#fff"
                  type="material-community"
                  size={20}
                  iconStyle={styles.icon1}
                  Component={TouchableOpacity}
                  onPress={() => this.props.navigation.navigate("Message")}
                />
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <Icon
                    name="account-group"
                    // reverse
                    color="#fff"
                    type="material-community"
                    size={28}
                    iconStyle={styles.icon}
                    Component={TouchableOpacity}
                    onPress={() =>
                      this.props.navigation.navigate("FamilyProfile")
                    }
                  />
                  <Icon
                    name="dots-vertical"
                    color="#fff"
                    type="material-community"
                    size={35}
                    // iconStyle={{ marginHorizontal: 10 }}
                    Component={TouchableOpacity}
                    // onPress={() => this.props.navigation.navigate("Menu")}
                    onPress={()=>getDetailInfomation()}
                  />
                </View>
                {/* <Icon
                  name="briefcase-upload-outline"
                  // reverse
                  color="#fff"
                  type="material-community"
                  size={28}
                  iconStyle={styles.icon}
                  Component={TouchableOpacity}
                /> */}
              </View>

              {/* avatar container */}
              <View style={styles.avatarContainer}>
                <Avatar
                  rounded
                  showEditButton
                  size={100}
                  source={{uri: this.state.avatar}}
                  editButton={{ onPress: () => {this.RBSheet.open()}, name: 'camera', type: 'material-community', color: '#fff', underlayColor: '#000' }}
                />

                <Text style={styles.naameText}>{global.USER.details.client_info.first_name}</Text>
              </View>

              {/* favourite back container */}
              <View style={styles.backContainer}>
                <TouchableOpacity
                  style={styles.favourateContainer}
                  // onPress={() => this.props.navigation.navigate("Favourites")}
                  onPress={()=>{getMyfavourite(0)}}
                  
                >
                  <Text style={styles.numberText}>{this.state.favorite.length?this.state.favorite.length:0}</Text>
                  <Text style={styles.favourateText}>Favourite</Text>
                </TouchableOpacity>
                <Divider style={styles.divider} />
                <TouchableOpacity
                  style={styles.favourateContainer}
                  onPress={() => this.props.navigation.navigate("Following",{
                    followers: this.state.followers,
                    following: this.state.following,
                    users: this.state.users,
                    selectedIndex: 0,
                    setData: this.setDataFromFollowing,
                    reload: this.reload
                  })}
                >
                  <Text style={styles.numberText}>{typeof this.state.followers!="undefined"?this.state.followers.length?this.state.followers.length:0:0}</Text>
                  <Text style={styles.favourateText}>Followers</Text>
                </TouchableOpacity>
                <Divider style={styles.divider} />
                <TouchableOpacity
                  style={styles.favourateContainer}
                  onPress={() => this.props.navigation.navigate("Following", {
                    following: this.state.following,
                    followers: this.state.followers,
                    users: this.state.users,
                    selectedIndex: 1,
                    setData: this.setDataFromFollowing,
                    reload: this.reload
                  })}
                >
                  <Text style={styles.numberText}>{typeof this.state.following!="undefined"?this.state.following.length?this.state.following.length:0:0}</Text>
                  <Text style={styles.favourateText}>Following</Text>
                </TouchableOpacity>
              </View>
            </View>
            
          </ImageBackground>
          <View style={styles.toggleContainer}>
            <View style={styles.notificationContainer}>
              <Icon
                name="bell-ring"
                //   reverse
                //   reverseColor="#000"
                color="#000"
                type="material-community"
                size={25}
                iconStyle={{ marginHorizontal: 6 }}
                // iconStyle={styles.icon}
                Component={TouchableOpacity}
              />
              <Text style={styles.notificationText}>
                Receive new post notifications
              </Text>
            </View>
            <View style={styles.switch}>
              <Switch
                thumbColor={this.state.switchValue ? "#009FFF" : "red"}
                onValueChange={this.toggleSwitch}
                value={this.state.switchValue}
              />
            </View>
          </View>
          <FlatGrid
            itemDimension={global.CONSTANT.WIDTH / 3 - 20}
            items={this.state.foodCourt}
            renderItem={({ item: item }) => (
              <View
                style={{position: "relative"}}
              >
              <TouchableOpacity
                onPress={()=>{getFCourtDetail(item.id)}}
              >
                {item.file_type =="video"?<Video
                                              source={{ uri:  "https://www.grubhouse.co.uk/upload/"+item.image}}
                                              rate={1.0}
                                              volume={0.0}
                                              isMuted={false}
                                              resizeMode="cover"
                                              shouldPlay
                                              isLooping
                                              style={styles.image} 
                                          />:<Image source={{ uri:  "https://www.grubhouse.co.uk/upload/"+item.image}} style={styles.image} />}
              </TouchableOpacity>
            </View>
            )}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  notificationText: {
    fontSize: 16,
    alignSelf: "center",
  },
  notificationContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  dialogContainer:{
    width: 200,
    height: 150,
    margin: "auto"
  },
  buttonContainer:{
    // flex: 9,
    marginLeft: 35,
    marginRight: 4
  },
  groupBtn: {
    height: 40, 
    width: 40, 
    marginRight: 10,
    borderRadius: 40,
    backgroundColor: "#E5E6EB",
    padding: 10,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 5,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  rbSheetContainer: {
    // flexDirection: "column",
    borderRadius: 50,
    justifyContent: "space-around",
    height: "100%"
  },
  bgContainer: {
    flex: 1,
    width: null
  },
  imageContainer: {
    // height: 320
    flex: 0.4
  },
  avatarContainer: {
    alignSelf: "center",
    // marginTop: 30
    // marginTop: "-13%"
    alignItems: "center"
  },
  iconContainer: {
    marginTop: global.CONSTANT.STATUSBAR + 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    // backgroundColor: "rgba(0, 0, 0,0.1)"
  },
  icon: {
    margin: 3
  },
  naameText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff"
  },
  locationText: {
    color: "#fff",
    textAlign: "center"
  },
  backContainer: {
    borderColor: "#fff",
    borderWidth: 1.5,
    margin: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 40,
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  favourateContainer: {
    alignSelf: "center",
    marginHorizontal: 14
  },
  numberText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    textAlign: "center"
  },
  favourateText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    resizeMode: "contain"
  },
  divider: {
    height: 62,
    width: 1,
    backgroundColor: "#fff"
  },
  image: {
    height: 140,
    width: global.CONSTANT.WIDTH / 3 - 7,
    resizeMode: "cover",
    marginVertical: -3
  }
  // orderContainer: {
  //   backgroundColor: global.COLOR.PRIMARY,
  //   height: 40,
  //   width: 156,
  //   borderRadius: 10,
  //   // marginBottom: 6,
  //   marginTop: 10
  // }
  // borderBackContainer: {
  //   flexDirection: "row",
  //   justifyContent: "space-evenly"
  // },
  // text: {
  //   textAlign: "center",
  //   fontSize: 14,
  //   fontWeight: "bold",
  //   marginTop: 10,
  //   color: "#fff"
  // },

  // likedText: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   margin: 11
  // },
  // overlay2: {
  //   height: 130,
  //   width: 116,
  //   marginTop: 4,
  //   resizeMode: "contain"
  // }
});
