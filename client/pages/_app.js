import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/buildClient";
import Header from "../components/Header";

export default function AppComponent({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
}

// Note how this is different from other pages
// the ctx attribute is nested within the context argument
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  // note how we are passing in the client
  // so each page does not need to use the buildClient helper
  const pageProps = await appContext?.Component?.getInitialProps?.(
    appContext.ctx,
    client,
    data.currentUser
  );
  console.log(pageProps);

  return {
    ...data,
    pageProps,
  };
};
