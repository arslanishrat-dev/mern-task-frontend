import axios from "axios";

export const ApiWrapper = async (method, route, data) => {
  const promise = axios({
    method: method,
    url: `${process.env.REACT_APP_API_BASE_URL}/${route}`,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("mern-auth-token"),
      "content-type": "multipart/form-data",
    },
    data: data,
  });

  const response = await promise
    .then((resp) => {
      return resp;
    })
    .catch((err) => {
      if (err.response.status === 401) {
        localStorage.clear();
        window.location.replace("/");
        return err.response;
      } else {
        return err.response;
      }
    });

  return response;
};
