import Admin from "./admin/Admin.vue";
import SocialMember from "./socialMember/SocialMember.vue";
import EventOrganizer from "./eventOrganizer/EventOrganizer.vue";
import EventExecutor from "./eventExecutor/EventExecutor.vue";

export default [
  {
    path: "/home",
    component: SocialMember
  },
  {
    path: "/admin",
    component: Admin
  },
  { path: "/eventOrganizer", component: EventOrganizer },
  { path: "/eventExecutor", component: EventExecutor }
];
