export default function Signup() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <form>
            <h1>Sign up</h1>
            <div className="form-group mt-2">
              <label>Email address</label>
              <input className="form-control"></input>
            </div>
            <div className="form-group mt-2">
              <label>Password</label>
              <input type="password" className="form-control"></input>
            </div>
            <button className="mt-4 btn btn-primary">Sign up</button>
          </form>
        </div>
      </div>
    </div>
  );
}
