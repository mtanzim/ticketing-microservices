import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  axios.get("/api/users/currentuser").catch((err) => {
    console.log(err.message);
  });

  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async () => {
  if (typeof window === "undefined") {
    // we are on the server!
    // requests should be made to ingress-controller in a separate namespace
    console.log("we in next server");
    const url =
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser";
    const { data } = await axios.get(url, {
      headers: {
        Host: "ticketing.dev",
      },
    });
    console.log(data);
    return data;
  } else {
    // we are on the browser
    // requests can be made to the base url
    console.log("we in chrome");
    const url = "/api/users/currentuser/";
    const { data } = await axios.get(url);
    console.log(data);
    return data;
  }
};
export default LandingPage;
