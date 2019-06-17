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
                  @click="socialBuyTicket(t.barCode, priceByTicket[t.barCode])"
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
      ticketsOnSocialSaleLoaded$: contractService.ticketsOnSocialSaleLoaded$,
      contractLoaded$: contractService.contractLoaded$,
      ticketPriceBySocialTicket$: contractService.ticketPriceBySocialTicket$,
      ticketSocialBought$: contractService.ticketSocialBought$,
      ticketIsOnSocialSale$: contractService.ticketIsOnSocialSale$
    };
  },
  data: () => ({
    dialog: false,
    ticketsOnSale: [],
    priceByTicket: {}
  }),
  methods: {
    loadTicketsOnSocialSale() {
      contractService.loadTicketsOnSocialSale();
    },
    socialBuyTicket(barCode, price) {
      contractService.socialBuyTicket(barCode, price);
    },
    getPriceByTicketOnSocialSale(barCode) {
      contractService.getPriceByTicketOnSocialSale(barCode);
    },
    getAvatarByState(state) {
      return getAvatarByState(state);
    },
    reloadTicketsOnSocialSale(tickets) {
      this.ticketsOnSale = tickets;
      this.ticketsOnSale.forEach(t => {
        if (!this.priceByTicket[t.barCode]) {
          contractService.getPriceByTicketOnSocialSale(t.barCode);
        }
      });
    }
  },
  created() {
    this.$observables.contractLoaded$.subscribe(isLoaded => {
      if (isLoaded) {
        this.loadTicketsOnSocialSale();
      } else {
        console.error("Error loading the contract");
      }
    });
    this.$observables.ticketIsOnSocialSale$.subscribe(msg => {
      this.loadTicketsOnSocialSale();
    });

    this.$observables.ticketsOnSocialSaleLoaded$.subscribe(tickets => {
      debugger;
      this.reloadTicketsOnSocialSale(tickets);
    });

    this.$observables.ticketPriceBySocialTicket$.subscribe(msg => {
      this.$set(this.priceByTicket, msg.barCode, msg.price);
    });

    this.$observables.ticketSocialBought$.subscribe(msg => {
      this.loadTicketsOnSocialSale();
    });
  }
};
</script>

