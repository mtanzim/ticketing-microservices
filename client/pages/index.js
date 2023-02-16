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
      {!!currentUser?.email ? (
        <p>{currentUser.email}</p>
      ) : (
        <div>
          <a href="/auth/signup/">please sign up</a>
          <p>Or</p>
          <a href="/auth/signin/">please sign in</a>
        </div>
      )}
    </div>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");
  return data;
};
export default LandingPage;
