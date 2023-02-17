import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/buildClient";
import Header from "../components/Header";

export default function AppComponent({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

// Note how this is different from other pages
// the ctx attribute is nested within the context argument
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  const pageProps = await appContext?.Component?.getInitialProps?.(
    appContext.ctx
  );
  console.log(pageProps);

  return {
    ...data,
    pageProps,
  };
};
