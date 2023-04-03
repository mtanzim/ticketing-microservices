import useRequest from "../../hooks/useRequest";
import Router from "next/router";

const Ticket = ({ ticket }) => {
  const { doRequest, errJSX } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <p>${ticket.price}</p>
      <button onClick={doRequest} className="btn btn-primary">
        Purchase
      </button>
      {errJSX}
    </div>
  );
};

Ticket.getInitialProps = async (context, client, currentUser) => {
  console.log(currentUser);
  const { ticketId } = context.query;
  const { data: ticket } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket };
};

export default Ticket;
