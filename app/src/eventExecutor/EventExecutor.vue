<template>
  <v-container>
    <v-alert :value="ticketExecuted$" dismissible type="success">Ticket successfully received</v-alert>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-layout align-start justify-center row fill-height>
            <v-flex xs6>
              <v-card-title primary-title>
                <div>
                  <div class="headline">Ticket Validator</div>
                </div>
              </v-card-title>
              <v-card-text>
                <div>
                  <v-flex xs8 sm8 md8>
                    <v-text-field v-model="barCode" label="Enter BarCode"></v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4 md4>
                    <v-btn @click="executeTicket" success>Receive</v-btn>
                  </v-flex>
                </div>
              </v-card-text>
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