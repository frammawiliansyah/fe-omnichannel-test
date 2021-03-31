import axios from "axios";
import { storage } from "../redux/local_storage";
import { OpResult } from "../helper/operation_result";

const Swal = require("sweetalert2");

class BaseApiRequest {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.token = undefined;
    this.config = undefined;
    //init token
    this.init();
  }

  init() {
    const store = storage.get(process.env.REACT_APP_LOCAL_STORAGE_NAME);
    if (store) {
      let account = store.account;
      if (account && store.token) {
        this.setConfig(store.token);
      }
    }
  }

  setConfig(token) {
    this.token = token;
    this.config = {
      headers: { authorization: token },
      validateStatus: function(status) {
        return status >= 200 && status < 500;
      }
    };
  }

  resetLocalStorageAndRedirect() {
    storage.delete(process.env.REACT_APP_LOCAL_STORAGE_NAME);
    Swal.fire("Sesi Habis", "Silahkan masuk kembali.", "info").then(() => {
      window.location.href = "/";
    });
  }

  async get(uri, params) {
    try {
      if (this.token) {
        let response = await axios.get(
          this.endpoint + uri,
          this.config,
          params
        );
        if (response.status >= 400 && response.status < 500) {
          if (response.status === 401) {
            this.resetLocalStorageAndRedirect();
          }

          let resp = response.data
            ? response.data
            : OpResult.failed(response.statusText);
          resp.code = response.status;
          return resp;
        } else {
          return response.data;
        }
      } else {
        this.resetLocalStorageAndRedirect();
      }
    } catch (error) {
      return OpResult.failed(`request failed`);
    }
  }

  async post(route, req_body) {
    try {
      if (this.token) {
        let response = await axios.post(
          this.endpoint + route,
          req_body,
          this.config
        );
        if (response.status >= 400 && response.status < 500) {
          if (response.status === 401) {
            this.resetLocalStorageAndRedirect();
          }

          let resp = response.data
            ? response.data
            : OpResult.failed(response.statusText);
          resp.code = response.status;
          return resp;
        } else {
          return response.data;
        }
      } else {
        this.resetLocalStorageAndRedirect();
      }
    } catch (error) {
      return OpResult.failed(`request failed`);
    }
  }

  async put(route, req_body) {
    try {
      if (this.token) {
        let response = await axios.put(
          this.endpoint + route,
          req_body,
          this.config
        );

        if (response.status >= 400 && response.status < 500) {
          let resp = OpResult.failed(response.statusText);
          resp.code = response.status;
          return resp;
        } else {
          return response.data;
        }
      } else return OpResult.failed(`request failed`);
    } catch (error) {
      return OpResult.failed(`request failed`);
    }
  }
  async delete() {}
}

export { BaseApiRequest };
