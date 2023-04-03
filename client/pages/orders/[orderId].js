const OrderShow = ({ order }) => {
  if (!order) {
    return "Something went wrong";
  }
  return (
    <div>
      <h1>Order</h1>
      <p>Status: {order.status}</p>
      <p>Expires at: {order.expiresAt}</p>
      <h2>Ticket</h2>
      <p>{order.ticket.title}</p>
      <p>${order.ticket.price}</p>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  try {
    const { data: order } = await client.get(`/api/orders/${orderId}`);
    return { order };
  } catch (err) {
    return { order: null };
  }
};

export default OrderShow;
