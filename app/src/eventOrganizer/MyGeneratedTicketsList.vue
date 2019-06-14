<template>
  <v-container>
    <v-layout>
      <v-flex xs12 md4>
        <v-text-field
          v-model="eventName"
          :rules="nameRules"
          :counter="10"
          label="Event Name"
          required
        ></v-text-field>
      </v-flex>

      <v-flex xs12 md4>
        <v-text-field
          v-model="eventNotes"
          :rules="nameRules"
          :counter="10"
          label="Event Name"
          required
        ></v-text-field>
      </v-flex>
      <v-flex xs12 md4>
        <v-btn color="success" @click="generate">Add</v-btn>
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
            <v-list-tile v-for="t in ticketsOnSale" :key="t.barCode">
              <v-list-tile-action>
                <v-btn flat icon color="red" @click="putTicketOnSale(t.barCode)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ticket.eventName}}</v-list-tile-title>
                <v-list-tile-sub-title>
                  <v-input prepend-icon="phone">{{price}}</v-input>
                </v-list-tile-sub-title>
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
    ticketsOnSale: [],
    eventName,
    eventNotes,
    price,
    nameRules: [
      v => !!v || "Address is required",
      v => v.length <= 10 || "Address must be less than 20 characters"
    ]
  }),
  methods: {
    putTicketOnSale(barCode) {},
    generate() {}
  }
};
</script>