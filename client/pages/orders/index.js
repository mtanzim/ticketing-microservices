import Link from "next/link";

const Orders = ({ orders }) => {
  return (
    <div>
      <h1>Orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.ticket.title}</td>
              <td>{order.status}</td>
              <td>${order.ticket.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Orders.getInitialProps = async (context, client, currentUser) => {
  const { data: orders } = await client.get("/api/orders");
  return { orders };
};

export default Orders;
