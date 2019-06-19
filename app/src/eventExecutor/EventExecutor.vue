<template>
  <v-container>
    <v-alert :value="ticketExecuted$" dismissible type="success">Ticket successfully received</v-alert>
    <v-layout row>
      <v-flex xs12>
        <v-card color="cyan darken-2" class="white--text">
          <v-layout align-start justify-center row fill-height>
            <v-flex xs6>
              <v-card-title primary-title>
                <div>
                  <div class="headline">Ticket Validator</div>
                  <div>
                    <v-flex xs12 sm12 md12>
                      <v-text-field v-model="barCode" label="Enter BarCode" outline></v-text-field>
                    </v-flex>
                  </div>
                </div>
              </v-card-title>
            </v-flex>
            <v-flex xs2>
              <div>
                <v-btn @click="executeTicket" success>Receive</v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import contractService from "../contract";
export default {
  subscriptions() {
    return {
      ticketExecuted$: contractService.ticketExecuted$
    };
  },
  data() {
    return {
      barCode: null
    };
  },
  methods: {
    executeTicket() {
      contractService.executeTicket(this.barCode);
    }
  }
};
</script>