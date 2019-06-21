export function getAvatarByState(state) {
  switch (state) {
    case "0":
      return "smiley-happy.png";
    case "1":
      return "smiley-wow.png";
    case "2":
      return "smiley-stars.png";
    case "3":
      return "smiley-money.png";
    case "4":
      return "smiley-love.png";
    case "5":
      return "smiley-blink.jpg";
    default:
      return "smiley-sad.png";
  }
}
