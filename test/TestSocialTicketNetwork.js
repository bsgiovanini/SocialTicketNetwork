const SocialTicketNetworkBase = artifacts.require("SocialTicketNetworkBase");

var accounts;
var owner;

contract("SocialTicketNetworkBase", accs => {
  accounts = accs;

  //generateTicket tests

  it("only eventOrganizers generate tickets", async () => {
    const instance = await SocialTicketNetworkBase.deployed();

    let user1 = accounts[1];
    let user2 = accounts[2];
    instance.addEventOrganizer(user1);
    await instance.generateTicket("Rock In Rio", "First day of the event", {
      from: user1
    });
    let barCode = 1;

    let result = await instance.tickets.call(barCode);
    assert.equal(result.ticketState, 0);
    assert.equal(result.eventOrganizerID, user1);
    assert.equal(result.ownerID, user1);
    assert.equal(result.eventName, "Rock In Rio");
    assert.equal(result.ticketNotes, "First day of the event");
    try {
      await instance.generateTicket("Rock In Rio", "Second day of the event", {
        from: user2
      });
    } catch (error) {
      assert.isAbove(error.message.search("DOES_NOT_HAVE_ORGANIZER_ROLE"), -1);
    }
  });
});
