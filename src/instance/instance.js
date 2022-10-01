import axios from "axios";

export const instance = axios.create({
  baseURL: "http://52.95.252.33:8080/api",
});
