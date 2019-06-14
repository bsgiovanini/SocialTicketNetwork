import Admin from "./admin/Admin.vue";
import SocialMember from "./socialMember/SocialMember.vue";

export default [
  {
    path: "/home",
    component: SocialMember
  },
  {
    path: "/admin",
    component: Admin
  }
];
