import axios from "axios";
import buildClient from "../api/buildClient";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  axios.get("/api/users/currentuser").catch((err) => {
    console.log(err.message);
  });

  return (
    <div>
      <h1>Landing Page</h1>
      <p>{currentUser?.email || "Please sign in"}</p>
    </div>
  );
};

LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get("/api/users/currentuser");
  return data;
};
export default LandingPage;
