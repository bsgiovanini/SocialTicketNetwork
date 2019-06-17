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

    await instance.expireTicket(barCode, {
      from: user1
    });

    result = await instance.tickets.call(barCode);
    assert.equal(result.ticketState, 6);
  });
});

contract("SocialTicketNetworkBase buyTicket tests", accs => {
  accounts = accs;

  it("only social members can buy tickets", async () => {
    const instance = await SocialTicketNetworkBase.deployed();

    let user1 = accounts[1];
    let user2 = accounts[2];
    let user3 = accounts[3];
    instance.addEventOrganizer(user1);
    instance.addSocialMember(user2);
    await instance.generateTicket("Rock In Rio", "First day of the event", {
      from: user1
    });
    let barCode = 1;

    let result = await instance.tickets.call(barCode);
    assert.equal(result.ticketState, 0);

    await instance.putTicketOnSale(barCode, 10, {
      from: user1
    });

    result = await instance.tickets.call(barCode);
    assert.equal(result.ticketState, 1);

    let ticketPrice = await instance.ticketsForSale.call(barCode);
    let balance = 10;
    await instance.buyTicket(barCode, {
      from: user2,
      value: balance
    });

    result = await instance.tickets.call(barCode);
    assert.equal(result.ticketState, 2);
    assert.equal(result.ownerID, user2);
  });
});

contract("SocialTicketNetworkBase putTicketOnSocialSale tests", accs => {
  accounts = accs;

  it("only social members who bought can socialSell tickets", async () => {
    const instance = await SocialTicketNetworkBase.deployed();

    let user1 = accounts[1];
    let user2 = accounts[2];
    let user3 = accounts[3];
    instance.addEventOrganizer(user1);
    instance.addSocialMember(user2);
    instance.addSocialMember(user3);
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

    let balance = 10;
    await instance.buyTicket(barCode, {
      from: user2,
      value: balance
    });

    result = await instance.tickets.call(barCode);
    assert.equal(result.ticketState, 2);

    try {
      await instance.socialPutTicketOnSale(barCode, 15, {
        from: user3
      });
    } catch (error) {
      assert.isAbove(
        error.message.search("TICKET NOT OWNED BY THE ADDRESS"),
        -1
      );
    }

    await instance.socialPutTicketOnSale(barCode, 15, {
      from: user2
    });

    result = await instance.tickets.call(barCode);
    assert.equal(result.ticketState, 3);

    let resultSale = await instance.ticketsForSocialSale.call(barCode);
    assert.equal(resultSale, 15);
  });

  it("only social members can socialBuy tickets", async () => {
    const instance = await SocialTicketNetworkBase.deployed();
    let user3 = accounts[3];
    let user4 = accounts[4];

    let barCode = 1;

    let balance = 15;
    try {
      await instance.socialBuyTicket(barCode, {
        from: user4,
        value: balance
      });
    } catch (error) {
      assert.isAbove(error.message.search("DOES_NOT_HAVE_MEMBER_ROLE"), -1);
    }
    await instance.socialBuyTicket(barCode, {
      from: user3,
      value: balance
    });

    result = await instance.tickets.call(barCode);
    assert.equal(result.ticketState, 4);
    assert.equal(result.ownerID, user3);
  });
});
