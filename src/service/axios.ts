import Axios from "axios";
import { baseApiURL } from "./consts";

export const axios = Axios.create({
  baseURL: baseApiURL,
});
