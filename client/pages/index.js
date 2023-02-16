import buildClient from "../api/buildClient";

const LandingPage = ({ currentUser }) => {
  return (
    <div>
      <h1>Landing Page</h1>
      {!!currentUser?.email ? (
        <p>{currentUser.email}</p>
      ) : (
        <p>Please sign up or sign in</p>
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
