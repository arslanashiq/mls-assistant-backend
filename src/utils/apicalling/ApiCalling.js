import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

export async function invokeApi({
  path,
  method = "GET",
  headers = {},
  queryParams = {},
  postData = {},
}) {
  // check authenticity
  // sing request

  //console.log(base_uri + path, "API URL");

  let reqObj = {
    method: method,
    url: path,
    headers: { ...headers },
  };

  //console.log("HEADER=>>",reqObj.headers)

  if (method === "GET") {
    reqObj["params"] = queryParams;
  }

  if (method === "POST") {
    reqObj["data"] = postData;
    reqObj["params"] = queryParams;
    //console.log("params called");
  }
  if (method === "PUT") {
    reqObj["data"] = postData;
    reqObj["params"] = queryParams;
    //console.log("params called");
  }
  if (method === "DELETE") {
    reqObj["data"] = postData;
    reqObj["params"] = queryParams;
    //console.log("params called");
  }

  let results = undefined;

  try {
    console.log("axios requestOBJ ==> ", reqObj);
    results = await axios(reqObj);
    console.log(results, "API results");
    return results.data;
  } catch (error) {
    console.log(error.response.status, "error.response.data.message");
    if (error.response.status === 401) {
      // alert(reqObj.url)
      // localStorage.clear();
      // window.location.reload();
    }
    return {
      code: error.response.status,
      message: error.response.data.message ? error.response.data.message : "",
    };

    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else if (
      error.response &&
      error.response.status &&
      error.response.statusText
    ) {
      //console.log(error.response);
      throw new Error(error.response.statusText);
    } else {
      //console.log(error);
      throw new Error("Some thing went wrong");
    }
  }

  if (results.status !== 200) {
    throw new Error(await results.text());
  }
}
