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

## Instructions for testing
