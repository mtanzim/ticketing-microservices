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

LandingPage.getInitialProps = async (context, client, currentUser) => {
  console.log(currentUser);
  return {};
};
export default LandingPage;
