import axios from "axios";

export const instance = axios.create({
  baseURL: "http://172.30.1.94:8090/api",
});
