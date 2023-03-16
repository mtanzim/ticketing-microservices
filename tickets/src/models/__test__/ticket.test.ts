import { Ticket } from "../ticket";

it("implements OCC control", async () => {
  const TITLE = "test123123123213";
  // create an instance of the ticket
  const ticket = Ticket.build({
    price: 33,
    title: TITLE,
    userId: "444",
  });
  // save ticket to DB
  await ticket.save();
  // fetch ticket twice
  const ticket1 = await Ticket.findOne({ title: TITLE });
  const ticket2 = await Ticket.findOne({ title: TITLE });

  // make separate changes to the tickets
  ticket1!.set({ price: 44 });
  ticket2!.set({ price: 49 });
  await ticket1!.save();

  try {
    await ticket2!.save();
  } catch (_) {
    expect(true).toBe(true);
    return;
  }
  throw new Error("test failed, should not come here");
});
