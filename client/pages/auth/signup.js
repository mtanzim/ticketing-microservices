import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setError] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError([]);
    try {
      const response = await axios.post("/api/users/signup", {
        email,
        password,
      });
      console.log(response.data);
    } catch (err) {
      setError(
        err?.response?.data?.errors || [{ message: "Something went wrong" }]
      );
    }
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
          <div>
            {errors?.map((e) => (
              <div class="alert alert-warning" role="alert">
                {e?.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
