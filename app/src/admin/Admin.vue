<template>
  <v-form v-model="valid">
    <v-container>
      <v-layout>
        <v-flex xs12 md4>
          <v-text-field
            v-model="address"
            :rules="addressRules"
            :counter="10"
            label="Address"
            required
          ></v-text-field>
        </v-flex>

        <v-flex xs12 md4>
          <v-combobox v-model="role" :items="roles" label="Select a role for the address"></v-combobox>
        </v-flex>
        <v-flex xs12 md4>
          <v-btn color="success" @click="add">Add</v-btn>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12 sm6>
          <v-card>
            <v-toolbar color="purple" dark>
              <v-toolbar-title>Event Organizers</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-list subheader three-line>
              <v-subheader>Addresses</v-subheader>
              <v-list-tile v-for="eo in eventOrganizers" :key="eo">
                <v-list-tile-action>
                  <v-checkbox v-model="notifications"></v-checkbox>
                </v-list-tile-action>

                <v-list-tile-content @click.prevent="notifications = !notifications">
                  <v-list-tile-title>{{eo}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6>
          <v-card>
            <v-toolbar color="purple" dark>
              <v-toolbar-title>Event Executors</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-list subheader three-line>
              <v-subheader>Addresses</v-subheader>
              <v-list-tile v-for="ee in eventExecutors" :key="ee">
                <v-list-tile-action>
                  <v-checkbox v-model="notifications"></v-checkbox>
                </v-list-tile-action>

                <v-list-tile-content @click.prevent="notifications = !notifications">
                  <v-list-tile-title>{{ee}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    address: "",
    role: "",
    addressRules: [
      v => !!v || "Address is required",
      v => v.length <= 20 || "Address must be less than 20 characters"
    ],
    roles: ["Event Organizer", "Event Executor"],
    eventOrganizers: [],
    eventExecutors: []
  }),
  methods: {
    add() {
      if (this.role === "Event Organizer") {
        this.eventOrganizers.push(this.address);
      } else if (this.role === "Event Executor") {
        this.eventExecutors.push(this.address);
      }
    }
  }
};
</script>
<style>
</style>

