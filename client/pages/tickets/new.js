import { useState } from "react";

const NewTicket = ({ currentUser }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("0.00");
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log({ price, title });
  };

  return (
    <div>
      <h1>Create a ticket</h1>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name of ticket"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group mt-2">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            placeholder="Price of the ticket"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button className="mt-4 btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
