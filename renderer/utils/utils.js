function change_p5_color_to_hex(p5Color) {
  // console.log('>>> p5_color: ', red(p5Color), green(p5Color), blue(p5Color));
  let hex_color = '#' + hex(Math.round(red(p5Color)), 2) + hex(Math.round(green(p5Color)), 2) + hex(Math.round(blue(p5Color)), 2);
  // console.log('>>> hex_color: ', hex_color);
  return hex_color;
}

function change_hex_color_to_p5(hex) {
  return color(hex);
}


function getRandomHexColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function second_to_nb_frame(sec) {
  return sec * frameRate()
}

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}
