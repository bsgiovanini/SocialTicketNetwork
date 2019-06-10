const SocialTicketNetworkBase = artifacts.require("SocialTicketNetworkBase");

var accounts;
var owner;

contract("SocialTicketNetworkBase generateTicket tests", accs => {
  accounts = accs;

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

contract("SocialTicketNetworkBase putTicketOnSale tests", accs => {
  accounts = accs;

  it("only eventOrganizers who generated can sell tickets", async () => {
    const instance = await SocialTicketNetworkBase.deployed();

    let user1 = accounts[1];
    let user2 = accounts[2];
    instance.addEventOrganizer(user1);
    instance.addEventOrganizer(user2);
    await instance.generateTicket("Rock In Rio", "First day of the event", {
      from: user1
    });
    let barCode = 1;

    let result = await instance.tickets.call(barCode);
    assert.equal(result.ticketState, 0);

    await instance.putTicketOnSale(barCode, 1, {
      from: user1
    });

    result = await instance.tickets.call(barCode);
    assert.equal(result.ticketState, 1);
    let resultSale = await instance.ticketsForSale.call(barCode);
    assert.equal(resultSale, 1);

    await instance.generateTicket("Rock In Rio", "Second day of the event", {
      from: user2
    });

    barCode = 2;

    try {
      await instance.putTicketOnSale(barCode, 1, {
        from: user1
      });
    } catch (error) {
      assert.isAbove(
        error.message.search("TICKET NOT OWNED BY THE ADDRESS"),
        -1
      );
    }
  });
});
