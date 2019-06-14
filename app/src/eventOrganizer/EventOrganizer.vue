<template>
  <v-container>
    <v-layout row>
      <MyGeneratedTicketsList/>
    </v-layout>
  </v-container>
</template>
<script>
import MyGeneratedTicketsList from "./MyGeneratedTicketsList.vue";

export default {
  components: {
    MyGeneratedTicketsList
  }
};
</script>