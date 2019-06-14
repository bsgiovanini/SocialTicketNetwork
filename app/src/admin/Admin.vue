<template>
  <v-form v-model="valid">
    <v-container>
      <v-alert :value="addressAdded$" type="success">Address successfully added</v-alert>
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
                  <v-btn flat icon color="red" @click="removeEOAddress(eo)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-tile-action>

                <v-list-tile-content>
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
                  <v-btn flat icon color="red" @click="removeEEAddress(ee)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-tile-action>

                <v-list-tile-content>
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
import contractService from "../contract";
export default {
  subscriptions() {
    return {
      addressAdded$: contractService.addressAdded$
    };
  },
  data: () => ({
    valid: false,
    address: "",
    role: "",
    addressRules: [
      v => !!v || "Address is required",
      v => v.length == 42 || "Address must be less than 20 characters"
    ],
    roles: ["Event Organizer", "Event Executor"],
    eventOrganizers: [],
    eventExecutors: []
  }),
  methods: {
    add() {
      if (
        this.eventExecutors.indexOf(this.address) >= 0 ||
        this.eventOrganizers.indexOf(this.address) >= 0
      ) {
        return;
      }
      if (this.role === "Event Organizer") {
        contractService.addEventOrganizer(this.address);
        this.eventOrganizers.push(this.address);
      } else if (this.role === "Event Executor") {
        contractService.addEventExecutor(this.address);
        this.eventExecutors.push(this.address);
      }
    },
    removeEEAddress(address) {
      this.eventExecutors = this.eventExecutors.filter(
        item => item !== address
      );
    },
    removeEOAddress(address) {
      this.eventOrganizers = this.eventOrganizers.filter(
        item => item !== address
      );
    }
  }
};
</script>
<style>
</style>

