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
                <v-btn flat icon color="red" @click="sellTicket(t.barCode)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ticket.eventName}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    myTickets: []
  }),
  methods: {
    sellTicket(barCode) {}
  }
};
</script>

