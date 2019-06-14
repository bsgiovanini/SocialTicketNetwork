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
    debugger;
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
}

export default new Contract();
