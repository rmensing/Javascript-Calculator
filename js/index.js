/* Due to floating point arithmatic decimal issues I am using the BigNumbers library*/
var entry = [];
var calc = [];
var totaled = true;
var btns = ['backspace', '=', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', '+', '-', '.',
  '\xF7', '=', '-', '.', '\xF7'
];
var keys = [8, 13, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100,
  101, 102, 103, 104, 105, 106, 107, 109, 110, 111, 187, 189, 190, 191
];
var chrCode = [8, 61, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 49, 50, 51,
  52, 53, 54, 55, 56, 57, 42, 43, 45, 46, 47, 61, 45, 46, 47
];
$(document).ready(function() {
  console.log("ready!");
  $('#entry').focus();
  /* had to put this preventDevault() function up here as the one below was not working*/
  $(document).bind("keydown keypress", function(e) {
    $('#entry').focus();
    if (e.which === 8) {
      e.preventDefault();
      keyClick(e.which);
    }
  });
  $('.key-box').mousedown(function() {
    $(this).toggleClass("hoverable clicked")
  })
  $('.key-box').mouseup(function() {
    $(this).toggleClass("hoverable clicked")
  })
  $('.key-box').mouseleave(function() {
    $(this).toggleClass("clicked", false);
    $(this).toggleClass("hoverable", true)
  })
  $('.key-box').click(function() {
    var btnTxt = $(this).children(':first').text();
    var keyCode = keys[btns.indexOf(btnTxt)];
    if (typeof keyCode !== 'undefined' && keyCode !== 8) { /*keycode 8 -backspace- goes to next if */
      keyClick(keyCode);
    } else if (btnTxt === 'C' || btnTxt === 'CE' || btnTxt ===
      'backspace') {
      clear(btnTxt);
    } else if (btnTxt === '\xB1') {
      plusmnToggle();
    } else {
      console.log('something went wrong!');
    }
  })
});
var debounce = function(fn) {
  var timeout;
  return function() {
    var args = Array.prototype.slice.call(arguments),
      ctx = this;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      fn.apply(ctx, args);
    }, 100);
  };
};
$('#entry').keydown(debounce(function(e) {
  $('#entry').focus();
  if (e.which === 8) {
    e.preventDefault();
  }
  if (keys.indexOf(e.which) > -1 && e.which !== 8) { /*backspace 8 handled above*/
    keyClick(e.which);
  }
}));

function keyClick(val) {
  /*convert keycode to chr code*/
  val = chrCode[keys.indexOf(val)];
  var ops = [8,13, 42, 43, 45, 46, 47, 61];
  var eLast = entry[entry.length - 1];
  var cLast = calc[calc.length - 1];
  if (ops.indexOf(val) === -1 || val === 46 && entry.indexOf('.') === -1) { /*Is it a number or decimal? also check for existing decimal. */
    console.log(val, String.fromCharCode(val));
    if(totaled){
      entry = [];
      $('#entry').val('');
      totaled = false;
    }
    entry.push(String.fromCharCode(val));
    $('#entry').val(entry.join(''));
  } else if (val === 8) {
    /*backspace*/
    clear('backspace');
  } else if (ops.indexOf(val) > -1 && entry.length > 0) {
    /*operators - check entry length to make sure we don't place an operator by itself*/
    if (val === 42 || val === 43 || val === 45 || val === 47){
      /* Mult, Add, Sub, Div */
      calc.push(entry.join(''),String.fromCharCode(val));
      $('#entry').val('');
      entry = [];
        $('#calc').val(calc.map(opReplace).join(''));
    }else if( val === 61 || val === 13){
      /* Equals or enter*/
      calc.push(entry.join(''));
      console.log(calc);
      $('#calc').val('');
      entry = [];
      /*entry.push(eval(calc.join('')));*/
      entry.push(calculate(calc));
      $('#entry').val(entry.join(''));
      calc = [];
      totaled = true;
    }
  }
}

function opReplace(item){
  if(item === '*'){
    return 'X';
  }else if(item === '/'){
    return '\xF7';
  }else{
    return item;
  }
}
function clear(btnTxt) {
  if (btnTxt === 'CE') {
    entry = [];
    $('#entry').val('');
  } else if (btnTxt === 'C') {
    entry = [];
    calc = [];
    $('#entry').val('');
    $('#calc').val('');
  } else if (btnTxt === 'backspace' && entry.length > 0) {
    entry.pop();
    $('#entry').val(entry.join(''));
  }
}

function plusmnToggle() {
  var temp = entry.join('')+'*(-1)';
  entry = [];
  entry.push(eval(temp));
  $('#entry').val(entry.join(''));
}
function calculate(calc){
  var op = '';
  var left = new BigNumber(calc[0]);
  for (var x=1;x<calc.length;x+=2){
    op = calc[x];
    var right = new BigNumber(calc[x+1]);
    switch(op){
      case '+':
        left = left.plus(right);
        break;
      case '-':
        left = left.minus(right);
        break;
      case '*':
        left = left.times(right);
        break;
      case '/':
        left = left.div(right);
        break
    }
  }
  console.log(left);
  return left;
}