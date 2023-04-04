import Router from "next/router";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";

const OrderShow = ({ order, currentUser }) => {
  const { doRequest, errJSX } = useRequest({
    url: "/api/payments",
    method: "post",
    body: { orderId: order.id },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });
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
      <p>Status: {order.status}</p>
      <h3>Ticket</h3>
      <p>{order.ticket.title}</p>
      <p>${order.ticket.price}</p>
      {timeRemaining > 0 ? (
        <div>
          <p>Time left to pay: {timeRemaining} seconds</p>
          <StripeCheckout
            token={({ id }) => doRequest(undefined, { token: id })}
            stripeKey="pk_test_51MqPNZG2Yz03o3oLSotW7rQwNU5MwNcHo5tK2ElVmqgXYbQcICV8vfH1h5fKhKMpfnS4rB3NOAswUCylK2tAUKxU00Z9lXcTmF"
            amount={(order?.ticket?.price || 0) * 100}
            email={currentUser.email}
          />
        </div>
      ) : (
        "order expired!"
      )}
      {errJSX}
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
