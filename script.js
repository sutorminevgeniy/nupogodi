(function(){
  var i;
  
  var testBl = document.getElementById('testBlock');

  var gameScreenWidth  = 544; 
      gameScreenHeight = 327; 

  var canvas = document.getElementById('gameCanvas'),
    ctx = canvas.getContext('2d');

  canvas.width  = gameScreenWidth; 
  canvas.height = gameScreenHeight; 

  var imgWolf = loadImage("img/wolf-98x152.png", 98, 152, [[[166, 152]],
                                                           [[287, 152]]]);

  imgWolf.dom.onload = function () {
    drawImage(imgWolf, 0, 0);
    drawImage(imgWolf, 1, 0);
  };
  

  var imgBasket = loadImage("img/basket-p-85x72.png", 85, 72, [[[116, 148],[110, 214]],
                                                               [[348, 155],[348, 221]]]);

  imgBasket.dom.onload = function (){
    drawImage(imgBasket, 0, 0);
    drawImage(imgBasket, 0, 1);
    drawImage(imgBasket, 1, 0);
    drawImage(imgBasket, 1, 1);
  };

  
  var bottonsControl = document.querySelectorAll('.gameControl');
  for(i=0;i<bottonsControl.length;i++){

    bottonsControl[i].addEventListener('click', function(event){
      var bottonControl = event.target;
      var pos = bottonControl.getAttribute('data-control').split('-');

      ctx.clearRect(0, 0, gameScreenWidth, gameScreenHeight);
      drawImage(imgWolf, pos[0], 0);
      drawImage(imgBasket, pos[0], pos[1]);
    });
  }

  // testBl.appendChild(imgBasket.dom);
  //_____________________________________________________

  function loadImage(path, width, height, pos) {
    var image = document.createElement('img');
    
    var result = {
        dom : image,
        width : width,
        height : height,
        pos: pos,
        count1 : (pos[0].length || 1),
        count2 : (pos.length || 1),
        loaded : false 
    };
    image.src = path;

    image.onload = function () {
        result.loaded = true;
    }
    return result;
  } 
  function drawImage(img, pos1, pos2) {
    ctx.drawImage(img.dom, 
                  img.width*pos1, img.height*pos2, 
                  img.width, img.height, 
                  img.pos[pos1][pos2][0], img.pos[pos1][pos2][1], 
                  img.width, img.height);
  }  
}());


