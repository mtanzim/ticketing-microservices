import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { doRequest, errJSX } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/")
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={onSubmit}>
            <h1>Sign up</h1>
            <div className="form-group mt-2">
              <label>Email address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
              ></input>
            </div>
            <div className="form-group mt-2">
              <label>Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="form-control"
              ></input>
            </div>
            <button className="mt-4 mb-4 btn btn-primary">Sign up</button>
          </form>
          <div>{errJSX}</div>
        </div>
      </div>
    </div>
  );
}
