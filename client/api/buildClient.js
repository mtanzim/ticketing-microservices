import axios from "axios";

export default function buildClient({ req }) {
  if (typeof window === "undefined") {
    // we are on the server!
    // requests should be made to ingress-controller in a separate namespace
    // TODO: add a switch here for local dev
    return axios.create({
      baseURL:
        "http://www.ticket-app-dev-test.shop",
      headers: req?.headers,
    });
  } else {
    // we are on the browser
    // requests can be made to the base url
    return axios.create({
      baseURL: "/",
    });
  }
}
