<template>
  <v-container>
    <v-card v-if="!role$ || role$ == 'register'">
      <v-layout align-start justify-center row fill-height>
        <v-flex xs6>
          <v-card-title primary-title>
            <div>
              <div class="headline">
                <strong>Social Ticket Network Membership</strong>
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <div>
              <v-flex xs12 sm12 md12>Waiting for membership registration...</v-flex>
              <v-flex xs12 sm12 md12>Please accept Metamask transaction</v-flex>
            </div>
          </v-card-text>
        </v-flex>
      </v-layout>
    </v-card>
    <template v-else>
      <v-layout row>
        <MyTicketsList/>
      </v-layout>
      <v-layout row>
        <OnSaleList/>
      </v-layout>
      <v-layout row>
        <OnSocialSaleList/>
      </v-layout>
    </template>
  </v-container>
</template>
<script>
import OnSaleList from "./OnSaleList.vue";
import MyTicketsList from "./MyTicketsList.vue";
import OnSocialSaleList from "./OnSocialSaleList.vue";
import contractService from "../contract";
export default {
  subscriptions() {
    return {
      role$: contractService.role$
    };
  },
  components: {
    OnSaleList,
    MyTicketsList,
    OnSocialSaleList
  }
};
</script>

