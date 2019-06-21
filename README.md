# Project 6: Social Ticket Network

Social Ticket Network is a project that allow buy, sell and trade tickets for events in a transparent way, avoiding the illegal commerce of fake tickets.

Project created as an assignment for Udacity BlockChain Developer Nanodegree Program - Ethereum Dapp for Tracking Items through Supply Chain.

It was developed from the webpack truffle box and designed using these core technologies:

```
Truffle v5.0.12 (core: 5.0.12)
Solidity v0.5.0 (solc-js)
Node v11.6.0
Web3.js v1.0.0-beta.37
OpenZeppelin v2.3.0
Truffle-hdwallet-provider v1.0.2
Webpack 4.28.1
Vue 2.6.10
```

Openzepelling was used for facilitating the contract building. The Base contract extends Ownable from Openzepelling. This way, I did not need to develop a Core contract and the base contract was deployed directly in the rinkeby network.

Vue was used as frontend framework, helping the calling of contract methods due to its reacitivy nature.

The contract generated was deployed in Rinkeby ethereum network under the Contract address [0xC96298d4ad1A298652BADC26ddbfA51eE9976672](https://rinkeby.etherscan.io/address/0xC96298d4ad1A298652BADC26ddbfA51eE9976672)

## Diagrams

### Activity Diagram

![Alt text](./diagrams/activity_diagram.png?raw=true "Activity Diagram")

### Sequence Diagram

![Alt text](./diagrams/sequence_diagram.png?raw=true "Sequence Diagram")

### State Diagram

![Alt text](./diagrams/state_diagram.png?raw=true "State Diagram")

### Data Model

![Alt text](./diagrams/data_model.png?raw=true "Data Model")

## Requirements

Plugin Metamask up and running in Chrome pointing to local truffle node

```
localhost:9545
```

Truffle v5 running

```
npm install -g truffle
```

Install openzeppelin

```
npm install openzeppelin-solidity
```

Install HD Wallet-enabled Web3 provider

```
npm install truffle-hdwallet-provider
```

Run truffle

```
truffle develop
```

Migrate contract. type migrate in truffle develop console

```
truffle(develop)> migrate
```

## Instructions for testing

running frontend

```
cd app
```

```
npm install
```

```
npm run dev
```

In Metamask, use truffle's seed phrase to access truffle accounts.

Logout your account and click in

```
Import using account seed phrase
```

Access the truffle console, copy the truffle phrase and paste it in Metamask field

## App usage

Application will run on port 8080

```
http://localhost:8080
```

### Creating Event Organizers and Event Executors

Only the owner of the contract can add Event Organizers and Event Executors. By default, Account 1 is the owner of the contract in truffle. Then, set your account to Account 1 in Metamask. Access or reload the page:

```
http://localhost:8080
```

and you will be redirected to the Admin Page. Copy and paste one of the other account addresses (ex. Account 2), select the Event Organizer Role and click in the ADD button. Select another account and add an Event Executor Role. Both actions require you approve the transaction generated in Metamask. If everything is ok, you will se a green message telling it was registered successfully.

### Event Organizers

After getting the Event Organizer Role, the account designed can be selected in Metamask and after a page reload, you will be redirected to the Event Organizer dashboard page. This step simulate an user, as an Event Organizer, accessing the application.

Event Organizers can generate a ticket (form in the top of the dashboard), put it on sale (option in Generated Tickets list) and expire it. All the operations are executed through his dashboard.

Tickets can be expired at any moment with exception when they are on Generated State or Finished State

For simplicity, Each ticket is managed individually.

### Social Ticket Members

When an account has no role in the application, automatically it will be requested to become a Social Member as soon as it access the application for the first time. The user must approve the transaction in Metamask. As soon as he approves the transaction, he will be redirected to the Social Member Dashboard where he can see all tickets on sale, see his own tickets and tickets put on sale by other social members.

If a ticket was put on sale by the Event Organizer, it can be visualized on Tickets on Sale List. The Member can buy the ticket by clicking on the right icon (Metamask transaction) and it will be shown on his My tickets List. Now he can opt for present it to the Event Executor and attend the event or resell it to another member, buy clicking on the right icon of the ticket in the My tickets list. If he opts for selling the ticket to another member, he estipulates the price and it will be available on the Social Sale List for another member. A member can not buy his own ticket.

### Event Executor

The same as Event Organizer, but the idea is to simulate the event attendance by the ticket owner, where the event executor will receive the ticket. This way, the event executor dashboard has a text field where the ticket bar code is filled and a button indicating the receipt of the ticket. Expired tickets are not accepted.
