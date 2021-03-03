import Axios from "axios";
Axios.defaults.baseURL = "http://grubhouse.co.uk/mobileappv2/api/";

export async function signUp(data) {
  var data = new FormData();
  data.append("user_mobile", email)

  const DATA = await Axios({
    method: "post",
    url: "retrievePassword",
    data,
    validateStatus: (status) => {
      return true;
    },
  }).then(res => {
    return res.data;
  }).catch(err => {
    alert(err);
    console.log(err);
  });
  return DATA;
}