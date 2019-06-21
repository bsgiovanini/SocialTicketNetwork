<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm12>
        <v-card>
          <v-toolbar dark>
            <v-toolbar-title>Tickets On Sale</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-list subheader three-line>
            <v-list-tile v-for="t in ticketsOnSale" :key="t.barCode">
              <v-list-tile-action>
                <v-btn
                  flat
                  icon
                  color="green"
                  @click="buyTicket(t.barCode, priceByTicket[t.barCode])"
                >
                  <v-icon>theaters</v-icon>
                </v-btn>
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
      ticketsOnSaleLoaded$: contractService.ticketsOnSaleLoaded$,
      ticketPriceByTicket$: contractService.ticketPriceByTicket$,
      ticketBought$: contractService.ticketBought$
    };
  },
  data: () => ({
    ticketsOnSale: [],
    priceByTicket: {}
  }),
  methods: {
    loadTicketsOnSale() {
      contractService.loadTicketsOnSale();
    },
    buyTicket(barCode, price) {
      contractService.buyTicket(barCode, price);
    },
    getPriceByTicketOnSale(barCode) {
      contractService.getPriceByTicketOnSale(barCode);
    },
    getAvatarByState(state) {
      return "../avatars/" + getAvatarByState(state);
    },
    reloadTicketsOnSale(tickets) {
      this.ticketsOnSale = tickets;
      this.ticketsOnSale.forEach(t => {
        if (!this.priceByTicket[t.barCode]) {
          contractService.getPriceByTicketOnSale(t.barCode);
        }
      });
    }
  },
  mounted() {
    this.$observables.ticketsOnSaleLoaded$.subscribe(tickets => {
      this.reloadTicketsOnSale(tickets);
    });

    this.$observables.ticketPriceByTicket$.subscribe(msg => {
      this.$set(this.priceByTicket, msg.barCode, msg.price);
    });

    this.$observables.ticketBought$.subscribe(msg => {
      this.loadTicketsOnSale();
    });

    this.loadTicketsOnSale();
  }
};
</script>

