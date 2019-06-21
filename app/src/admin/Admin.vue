<template>
  <v-form v-model="valid">
    <v-container>
      <v-alert :value="addressAdded$" dismissible type="success">Address successfully added</v-alert>
      <v-layout>
        <v-flex xs12 md4>
          <v-text-field
            v-model="address"
            :rules="addressRules"
            :counter="42"
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
    }
  }
};
</script>
<style>
</style>

