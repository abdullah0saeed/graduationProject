///creating a random array of numbers from 0 to 5 \\\\\\\\\\\\\\\\\\\\\\\\\\
export default function random(length) {
  var i = 0;
  var firstNum = 7;
  while (firstNum >= 6) {
    firstNum = Math.floor(Math.random() * length);
  }
  var randoms = [firstNum];
  while (i < length - 1) {
    var num = Math.floor(Math.random() * length);
    var count = 0;
    if (num < 6) {
      for (let r = 0; r < randoms.length; r++) {
        if (num === randoms[r]) {
          count += 1;
        }
      }
      if (count === 0) {
        randoms.push(num);
        i++;
      } else {
        continue;
      }
    } else {
      continue;
    }
  }
  return randoms;
}
