<template>
  <v-container>
    <v-layout row>
      <OwnedTicketsList/>
    </v-layout>
  </v-container>
</template>
<script>
import OwnedTicketsList from "./OwnedTicketsList.vue";

export default {
  components: {
    OwnedTicketsList
  }
};
</script>