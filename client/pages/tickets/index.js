const Tickets = ({ tickets }) => {
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>${t.price}</td>
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
