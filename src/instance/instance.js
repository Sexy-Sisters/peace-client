import axios from "axios";

export const instance = axios.create({
  baseURL: "http://192.168.0.9:8090/api",
});
