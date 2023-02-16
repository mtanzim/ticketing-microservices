import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/buildClient";

export default function AppComponent({ Component, pageProps }) {
  console.log(pageProps);
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            GitTix
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a
                className="nav-link active"
                aria-current="page"
                href="/auth/signup"
              >
                Sign up
              </a>
              <a
                className="nav-link active"
                aria-current="page"
                href="/auth/signin"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div className="container">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

// Note how this is different from other pages
// the ctx attribute is nested within the context argument
AppComponent.getInitialProps = async (context) => {
  const client = buildClient(context.ctx);
  const { data } = await client.get("/api/users/currentuser");
  return data;
};
