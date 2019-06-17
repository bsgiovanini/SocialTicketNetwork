<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm12>
        <v-card>
          <v-toolbar dark>
            <v-toolbar-title>My Tickets</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-list subheader three-line>
            <v-list-tile v-for="t in myTickets" :key="t.barCode">
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
                      <v-btn
                        color="green darken-1"
                        flat
                        @click="putTicketOnSocialSale(t.barCode)"
                      >Confirm</v-btn>
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
  </v-container>
</template>
<script>
import contractService from "../contract";
import { getAvatarByState } from "../util";
export default {
  subscriptions() {
    return {
      myTicketsLoaded$: contractService.myTicketsLoaded$,
      contractLoaded$: contractService.contractLoaded$,
      ticketBought$: contractService.ticketBought$,
      ticketIsOnSocialSale$: contractService.ticketIsOnSocialSale$
    };
  },
  data: () => ({
    dialog: false,
    price: "",
    myTickets: [],
    rules: {
      required: value => !!value || "Required."
    }
  }),
  methods: {
    putTicketOnSocialSale(barCode) {
      contractService.putTicketOnSocialSale(barCode, this.price);
    },
    loadMyTickets() {
      contractService.loadMyTickets();
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
      this.myTickets = tickets;
    });
    this.$observables.ticketBought$.subscribe(msg => {
      this.loadMyTickets();
    });
    this.$observables.ticketIsOnSocialSale$.subscribe(msg => {
      this.loadMyTickets();
    });
  }
};
</script>

