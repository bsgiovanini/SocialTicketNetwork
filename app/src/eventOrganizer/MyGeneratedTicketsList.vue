<template>
  <v-container>
    <v-alert :value="ticketGenerated$" dismissible type="success">Ticket successfully generated</v-alert>
    <v-alert :value="ticketIsOnSale$" dismissible type="success">Ticket is on Sale!</v-alert>
    <v-alert :value="ticketExpired$" dismissible type="warning">Ticket was expired!</v-alert>
    <v-layout>
      <v-flex xs12 md4>
        <v-text-field
          v-model="eventName"
          :rules="nameRules"
          :counter="30"
          label="Ticket Event Name"
          required
        ></v-text-field>
      </v-flex>

      <v-flex xs12 md4>
        <v-text-field
          v-model="ticketNotes"
          :rules="nameRules"
          :counter="30"
          label="Ticket Notes"
          required
        ></v-text-field>
      </v-flex>
      <v-flex xs12 md4>
        <v-btn color="success" @click="generate">Generate Ticket</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm12>
        <v-card>
          <v-toolbar dark>
            <v-toolbar-title>Generated Tickets</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-list subheader three-line>
            <v-list-tile v-for="t in ticketsGenerated" :key="t.barCode">
              <v-list-tile-action>
                <v-dialog v-model="dialog" persistent max-width="290">
                  <template v-slot:activator="{ on }">
                    <v-btn flat icon color="green" v-on="on">
                      <v-icon>theaters</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="headline">Put this ticket on sale?</v-card-title>
                    <v-card-text>
                      <v-text-field
                        label="Price"
                        placeholder="Wei"
                        v-model="price"
                        :rules="[rules.required]"
                        required
                      ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red darken-1" flat @click="dialog = false">Cancel</v-btn>
                      <v-btn color="green darken-1" flat @click="putTicketOnSale(t.barCode)">Confirm</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{t.eventName}}</v-list-tile-title>
                <v-list-tile-sub-title>{{t.ticketNotes}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-avatar>
                <img :src="getAvatarByState(t.ticketState)">
              </v-list-tile-avatar>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm12>
        <v-card>
          <v-toolbar dark>
            <v-toolbar-title>Tickets On Sale</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-list subheader three-line>
            <v-list-tile v-for="t in expirableTickets" :key="t.barCode">
              <v-list-tile-action>
                <v-dialog v-model="dialog2" persistent max-width="290">
                  <template v-slot:activator="{ on }">
                    <v-btn flat icon color="red" v-on="on">
                      <v-icon>theaters</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="headline">This ticket will expire!</v-card-title>
                    <v-card-text>Are you sure?</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red darken-1" flat @click="dialog2 = false">Cancel</v-btn>
                      <v-btn color="green darken-1" flat @click="expireTicket(t.barCode)">Confirm</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{t.eventName}}</v-list-tile-title>
                <v-list-tile-sub-title>{{t.ticketNotes}}</v-list-tile-sub-title>
                <v-list-tile-sub-title>Price: {{priceByTicket[t.barCode]}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-avatar>
                <img :src="getAvatarByState(t.ticketState)">
              </v-list-tile-avatar>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import contractService from "../contract";
import { getAvatarByState } from "../util";
export default {
  subscriptions() {
    return {
      ticketGenerated$: contractService.ticketGenerated$,
      myTicketsLoaded$: contractService.myTicketsLoaded$,
      contractLoaded$: contractService.contractLoaded$,
      ticketIsOnSale$: contractService.ticketIsOnSale$,
      ticketPriceByTicket$: contractService.ticketPriceByTicket$,
      ticketExpired$: contractService.ticketExpired$
    };
  },
  data: () => ({
    dialog: false,
    dialog2: false,
    expirableTickets: [],
    ticketsGenerated: [],
    ticketsOnsale: [],
    priceByTicket: {},
    rules: {
      required: value => !!value || "Required."
    },

    eventName: "",
    ticketNotes: "",
    price: "",
    nameRules: [
      v => !!v || "Address is required",
      v => v.length <= 40 || "Address must be less than 20 characters"
    ]
  }),
  methods: {
    putTicketOnSale(barCode) {
      if (!!this.price || !isNaN(this.price)) {
        this.dialog = false;
        contractService.putTicketOnSale(barCode, this.price);
      }
    },
    generate() {
      contractService.generateTicket(this.eventName, this.ticketNotes);
    },
    loadMyTickets() {
      contractService.loadMyTickets();
    },
    expireTicket(barCode) {
      debugger;
      this.dialog2 = false;
      contractService.expireTicket(barCode);
    },

    getPriceByTicketOnSale(barCode) {
      contractService.getPriceByTicketOnSale(barCode);
    },
    getAvatarByState(state) {
      return getAvatarByState(state);
    }
  },
  created() {
    this.$observables.contractLoaded$.subscribe(isLoaded => {
      if (isLoaded) {
        this.loadMyTickets();
      } else {
        console.error("Error loading the contract");
      }
    });
    this.$observables.myTicketsLoaded$.subscribe(tickets => {
      this.expirableTickets = tickets.filter(ticket => ticket.ticketState > 0);
      this.ticketsGenerated = tickets.filter(ticket => ticket.ticketState == 0);
      this.ticketsOnSale = tickets.filter(ticket => ticket.ticketState == 1);
      this.ticketsOnSale.forEach(t => {
        if (!this.priceByTicket[t.barCode]) {
          contractService.getPriceByTicketOnSale(t.barCode);
        }
      });
    });
    this.$observables.ticketGenerated$.subscribe(msg => {
      this.loadMyTickets();
    });
    this.$observables.ticketGenerated$.subscribe(msg => {
      this.loadMyTickets();
    });

    this.$observables.ticketIsOnSale$.subscribe(msg => {
      this.loadMyTickets();
    });

    this.$observables.ticketExpired$.subscribe(msg => {
      this.loadMyTickets();
    });

    this.$observables.ticketPriceByTicket$.subscribe(msg => {
      this.$set(this.priceByTicket, msg.barCode, msg.price);
    });
  }
};
</script>