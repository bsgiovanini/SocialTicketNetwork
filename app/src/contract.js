import socialTicketNetworkArtifact from "../../build/contracts/SocialTicketNetworkBase.json";
import Web3 from "web3";
import { Subject } from "rxjs";

class Contract {
  constructor() {
    this.contractLoaded$ = new Subject();
    this.isOwner$ = new Subject();
    this.isSocialMember$ = new Subject();
    this.role$ = new Subject();
    this.addressAdded$ = new Subject();
    this.owner$ = new Subject();
    this.ticketGenerated$ = new Subject();
    this.myTicketsLoaded$ = new Subject();
    this.ticketIsOnSale$ = new Subject();
    this.ticketPriceByTicket$ = new Subject();
    this.ticketExpired$ = new Subject();
    this.ticketsOnSaleLoaded$ = new Subject();
    this.ticketBought$ = new Subject();
    this.ticketIsOnSocialSale$ = new Subject();
    this.ticketsOnSocialSaleLoaded$ = new Subject();
    this.ticketPriceBySocialTicket$ = new Subject();
    this.ticketSocialBought$ = new Subject();
    this.ticketExecuted$ = new Subject();

    if (window.ethereum) {
      // use MetaMask's provider
      this.web3 = new Web3(window.ethereum);
      window.ethereum.enable(); // get permission to access accounts
    } else {
      console.warn(
        "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live"
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:9545")
      );
    }
    try {
      // get contract instance
      this.web3.eth.net.getId().then(networkId => {
        const deployedNetwork = socialTicketNetworkArtifact.networks[networkId];
        this.meta = new this.web3.eth.Contract(
          socialTicketNetworkArtifact.abi,
          deployedNetwork.address
        );
        this.web3.eth.getAccounts().then(accounts => {
          this.account = accounts[0];
          this.contractLoaded$.next(true);
        });
      });

      // get accounts
    } catch (error) {
      console.error("Could not connect to contract or chain.");
      this.contractLoaded$.next(false);
    }
  }

  whoIsOwner() {
    const { owner } = this.meta.methods;
    owner()
      .call()
      .then(is => {
        this.owner$.next(is);
      });
  }

  role() {
    const {
      isSocialMember,
      isEventOrganizer,
      isEventExecutors,
      isOwner
    } = this.meta.methods;
    Promise.all([
      isSocialMember(this.account).call(),
      isEventOrganizer(this.account).call(),
      isEventExecutors(this.account).call(),
      isOwner(this.account).call()
    ]).then(values => {
      if (values[0]) this.role$.next("socialMember");
      if (values[1]) this.role$.next("eventOrganizer");
      if (values[2]) this.role$.next("eventExecutor");
      if (values[3]) this.role$.next("admin");
      if (!values[0] && !values[1] && !values[2] && !values[3])
        this.role$.next("register");
    });
  }

  addSocialMember() {
    const { addSocialMember } = this.meta.methods;
    addSocialMember(this.account)
      .send({ from: this.account })
      .then(msg => {
        this.role$.next("socialMember");
      });
  }

  addEventOrganizer(account) {
    const { addEventOrganizer } = this.meta.methods;
    addEventOrganizer(account)
      .send({ from: this.account })
      .then(msg => {
        this.addressAdded$.next(msg);
      });
  }

  addEventExecutor(account) {
    const { addEventExecutors } = this.meta.methods;
    addEventExecutors(account)
      .send({ from: this.account })
      .then(msg => {
        this.addressAdded$.next(msg);
      });
  }

  generateTicket(eventName, ticketNotes) {
    const { generateTicket } = this.meta.methods;
    generateTicket(eventName, ticketNotes)
      .send({ from: this.account })
      .then(msg => {
        this.ticketGenerated$.next(msg);
      });
  }

  putTicketOnSale(barCode, price) {
    const { putTicketOnSale } = this.meta.methods;
    putTicketOnSale(barCode, price)
      .send({ from: this.account })
      .then(msg => {
        this.ticketIsOnSale$.next({ barCode, price });
      });
  }

  putTicketOnSocialSale(barCode, price) {
    const { socialPutTicketOnSale } = this.meta.methods;
    socialPutTicketOnSale(barCode, price)
      .send({ from: this.account })
      .then(msg => {
        this.ticketIsOnSocialSale$.next({ barCode, price });
      });
  }

  getPriceByTicketOnSale(barCode) {
    const { getPriceByTicketOnSale } = this.meta.methods;
    getPriceByTicketOnSale(barCode)
      .call()
      .then(price => {
        this.ticketPriceByTicket$.next({ barCode, price });
      });
  }

  getPriceByTicketOnSocialSale(barCode) {
    const { getPriceByTicketOnSocialSale } = this.meta.methods;
    getPriceByTicketOnSocialSale(barCode)
      .call()
      .then(price => {
        this.ticketPriceBySocialTicket$.next({ barCode, price });
      });
  }

  expireTicket(barCode) {
    const { expireTicket } = this.meta.methods;
    expireTicket(barCode)
      .send({ from: this.account })
      .then(msg => {
        this.ticketExpired$.next(msg);
      });
  }

  loadMyTickets() {
    const { loadTicketsByOwner, getTicketByBarCode } = this.meta.methods;
    loadTicketsByOwner(this.account)
      .call()
      .then(tickets => {
        const toReturn = [];
        const promises = [];
        tickets.forEach(ticket => {
          promises.push(getTicketByBarCode(ticket).call());
        });
        Promise.all(promises).then(data => {
          data.forEach(tkt => {
            if (tkt[2].trim().length > 0 && tkt[4] != 3)
              toReturn.push({
                ownerID: tkt[0],
                eventOrganizerID: tkt[1],
                eventName: tkt[2],
                ticketNotes: tkt[3],
                ticketState: tkt[4],
                lastSocialMemberID: tkt[5],
                barCode: tkt[6]
              });
          });
          this.myTicketsLoaded$.next(toReturn);
        });
      });
  }
  loadTicketsOnSale() {
    const { loadTicketsOnSale, getTicketByBarCode } = this.meta.methods;
    loadTicketsOnSale()
      .call()
      .then(tickets => {
        const toReturn = [];
        const promises = [];
        tickets.forEach(ticket => {
          promises.push(getTicketByBarCode(ticket).call());
        });
        Promise.all(promises).then(data => {
          data.forEach(tkt => {
            if (tkt[2].trim().length > 0)
              toReturn.push({
                ownerID: tkt[0],
                eventOrganizerID: tkt[1],
                eventName: tkt[2],
                ticketNotes: tkt[3],
                ticketState: tkt[4],
                lastSocialMemberID: tkt[5],
                barCode: tkt[6]
              });
          });
          this.ticketsOnSaleLoaded$.next(toReturn);
        });
      });
  }

  buyTicket(barCode, price) {
    const { buyTicket } = this.meta.methods;
    buyTicket(barCode)
      .send({
        from: this.account,
        value: price
      })
      .then(msg => {
        this.ticketBought$.next(msg);
      });
  }

  socialBuyTicket(barCode, price) {
    const { socialBuyTicket } = this.meta.methods;
    socialBuyTicket(barCode)
      .send({
        from: this.account,
        value: price
      })
      .then(msg => {
        this.ticketSocialBought$.next(msg);
      });
  }

  loadTicketsOnSocialSale() {
    const { loadTicketsOnSocialSale, getTicketByBarCode } = this.meta.methods;
    loadTicketsOnSocialSale()
      .call()
      .then(tickets => {
        const toReturn = [];
        const promises = [];
        tickets.forEach(ticket => {
          promises.push(getTicketByBarCode(ticket).call());
        });
        Promise.all(promises).then(data => {
          data.forEach(tkt => {
            if (tkt[2].trim().length > 0)
              toReturn.push({
                ownerID: tkt[0],
                eventOrganizerID: tkt[1],
                eventName: tkt[2],
                ticketNotes: tkt[3],
                ticketState: tkt[4],
                lastSocialMemberID: tkt[5],
                barCode: tkt[6]
              });
          });
          this.ticketsOnSocialSaleLoaded$.next(toReturn);
        });
      });
  }

  executeTicket(barCode) {
    const { receiveTicket } = this.meta.methods;
    receiveTicket(barCode)
      .send({
        from: this.account
      })
      .then(msg => {
        this.ticketExecuted$.next(msg);
      });
  }
}

export default new Contract();
