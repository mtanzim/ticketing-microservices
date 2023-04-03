import { useEffect, useState } from "react";

const OrderShow = ({ order }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  useEffect(() => {
    const findTimeLeft = () => {
      const expiresAt = new Date(order.expiresAt);
      const now = new Date();
      const delta = Math.round((expiresAt - now) / 1000);
      setTimeRemaining(delta);
    };
    if (order?.expiresAt) {
      findTimeLeft();
      const timerId = setInterval(findTimeLeft, 1000);
      return () => clearInterval(timerId);
    }
  }, [order]);

  if (!order) {
    return "Something went wrong";
  }

  return (
    <div>
      <h1>Order</h1>
      <p>{order.ticket.title}</p>
      <p>${order.ticket.price}</p>
      {timeRemaining > 0 ? (
        <p>Time left to pay: {timeRemaining} seconds</p>
      ) : (
        "order expired!"
      )}

      {timeRemaining > 0 && <button className="btn btn-primary">Pay</button>}
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
