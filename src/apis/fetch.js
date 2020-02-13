import axios from "axios";
import {DELETE, GET, PATCH, POST, PUT} from "./constants";

let CancelToken = axios.CancelToken;

let cancel = () => {
};
export const cancelRequest = () => {
  return cancel;
};

const getQueryString = (params) => {
  if (!params)
    return "";

  let esc = encodeURIComponent;
  return (
    "?" +
    Object.keys(params)
      .map(k => esc(k) + "=" + esc(params[k]))
      .join("&")
  );
};

const getJsonBody = (params) => {
  return params;
};

export const setBaseUrl = (value) => {
  axios.defaults.baseURL = value;
};

export const setHeader = (params) => {
  Object.entries(params).forEach(([key, value]) => {
    axios.defaults.headers.common[key] = value;
  });
};
export default (requestType, resourceURL, parameters, headers, config) => {
  // Object.entries(headers).forEach(([key, value]) => {
  //   axios.defaults.headers.common[key] = value;
  // });

  switch (requestType) {
    case GET:
      return new Promise((resolve, reject) => {
        const queryString = getQueryString(parameters);
        axios
          .get(resourceURL + queryString, {
            ...config,
            cancelToken: new CancelToken(c => {
              cancel = c;
            }),
            headers: headers,
          })
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      });

    case POST:
      return new Promise((resolve, reject) => {
        const jsonBody = getJsonBody(parameters);
        axios
          .post(resourceURL, jsonBody, {
            ...config,
            cancelToken: new CancelToken(c => {
              cancel = c;
            }),
            headers: headers,
          })
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      });

    case PUT:
      return new Promise((resolve, reject) => {
        const jsonBody = getJsonBody(parameters);
        axios
          .put(resourceURL, jsonBody, {
            ...config,
            cancelToken: new CancelToken(c => {
              cancel = c;
            }),
            headers: headers,
          })
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      });

    case PATCH:
      return new Promise((resolve, reject) => {
        const jsonBody = getJsonBody(parameters);
        axios
          .patch(resourceURL, jsonBody, {
            ...config,
            cancelToken: new CancelToken(c => {
              cancel = c;
            }),
            headers: headers,
          })
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      });

    case DELETE:
      return new Promise((resolve, reject) => {
        const queryString = getQueryString(parameters);
        axios
          .delete(resourceURL + queryString, {
            ...config,
            cancelToken: new CancelToken(c => {
              cancel = c;
            }),
            headers: headers,
          })
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      });

    default:
      break;
  }
};
