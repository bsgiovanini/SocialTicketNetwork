<template>
  <v-app>
    <v-navigation-drawer app>
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title class="title">Social Ticket Network</v-list-tile-title>
              <v-list-tile-sub-title>{{owner$}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list dense class="pt-0">
        <v-list-tile :to="role.link">
          <v-list-tile-action>
            <v-icon>{{role.icon}}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{role.title}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>


<script>
import contractService from "./contract";
export default {
  subscriptions() {
    return {
      contractLoaded$: contractService.contractLoaded$,
      role$: contractService.role$,
      owner$: contractService.owner$
    };
  },
  data() {
    return {
      right: true,
      role: { link: "/", icon: "home", title: "Loading..." },
      roles: {
        admin: { link: "/admin", icon: "home", title: "Admin" },
        eventOrganizer: {
          link: "/eventOrganizer",
          icon: "home",
          title: "Organizer"
        },
        eventExecutor: {
          link: "/eventExecutor",
          icon: "home",
          title: "Executor"
        },
        socialMember: { link: "/socialMember", icon: "home", title: "Member" }
      }
    };
  },
  methods: {
    whoIsOwner() {
      contractService.whoIsOwner();
    },
    checkRole() {
      contractService.role();
    },
    addSocialMember() {
      contractService.addSocialMember();
    }
  },
  created() {
    this.$observables.contractLoaded$.subscribe(isLoaded => {
      if (isLoaded) {
        this.whoIsOwner();
        this.checkRole();
      } else {
        console.error("Error loading the contract");
      }
    });
    this.$observables.role$.subscribe(role => {
      if (role === "register") {
        this.addSocialMember();
      } else {
        this.role = this.roles[role];
        this.$router.push(this.role.link);
      }
    });
  }
};
</script>

<style>
</style>
