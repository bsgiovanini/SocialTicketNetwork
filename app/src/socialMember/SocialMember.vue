<template>
  <v-container>
    <v-layout row>
      <MyTicketsList/>
    </v-layout>
    <v-layout row>
      <OnSaleList/>
    </v-layout>
    <v-layout row>
      <OnSocialSaleList/>
    </v-layout>
  </v-container>
</template>
<script>
import OnSaleList from "./OnSaleList.vue";
import MyTicketsList from "./MyTicketsList.vue";
import OnSocialSaleList from "./OnSocialSaleList.vue";
export default {
  components: {
    OnSaleList,
    MyTicketsList,
    OnSocialSaleList
  }
};
</script>

