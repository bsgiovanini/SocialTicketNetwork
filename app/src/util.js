export function getAvatarByState(state) {
  switch (state) {
    case "0":
      return "https://cdn.vuetifyjs.com/images/lists/1.jpg";
    case "1":
      return "https://cdn.vuetifyjs.com/images/lists/2.jpg";
    case "2":
      return "https://cdn.vuetifyjs.com/images/lists/3.jpg";
    case "3":
      return "https://cdn.vuetifyjs.com/images/lists/4.jpg";
    case "4":
      return "https://cdn.vuetifyjs.com/images/lists/5.jpg";
    case "5":
      return "https://cdn.vuetifyjs.com/images/lists/6.jpg";
    default:
      return "https://cdn.vuetifyjs.com/images/lists/7.jpg";
  }
}
