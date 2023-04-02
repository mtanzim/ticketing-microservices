import Link from "next/link";

const Tickets = ({ tickets }) => {
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>${t.price}</td>
              <td>
                <Link
                  className="nav-link"
                  href="/tickets/[ticketId]"
                  as={`/tickets/${t.id}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Tickets.getInitialProps = async (context, client, currentUser) => {
  console.log(currentUser);
  const { data: tickets } = await client.get("/api/tickets");
  return { tickets };
};

export default Tickets;
