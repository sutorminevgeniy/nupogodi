(function(){
  var canvas = document.getElementById('gameCanvas'),
      ctx = canvas.getContext('2d'),
      gameScreenWidth  = 544, 
      gameScreenHeight = 327; 
      canvas.width  = gameScreenWidth; 
      canvas.height = gameScreenHeight; 

  function Figura(path, width, height, pos){
    this.loadImage(path, width, height, pos);
  }
  Figura.prototype.loadImage = function (path, width, height, pos) {
    this.dom = document.createElement('img');
    this.dom.src = path;

    this.width = width;
    this.height = height;
    this.pos = pos;
    this.count1 = (pos[0].length || 1);
    this.count2 = (pos.length || 1);
    this.loaded = false;

    var that = this;
    that.dom.addEventListener('load', function (){
      that.loaded = true;
    });
  }
  Figura.prototype.drawImage = function (pos0, pos1) {
    var that = this;
    var drawImg = function (){
      ctx.drawImage(that.dom, 
                  that.width*pos0, that.height*pos1, 
                  that.width, that.height, 
                  that.pos[pos0][pos1][0], that.pos[pos0][pos1][1], 
                  that.width, that.height);
    }
    if(that.loaded){
      drawImg();
    } else {
      that.dom.addEventListener('load', function (){
        drawImg();
      });
    }
  }


  function Volf(){
    this.volfBody = new Figura("img/wolf-98x152.png", 
                              98, 152, 
                              [[[166, 152]],
                               [[287, 152]]]);
    this.basket = new Figura("img/basket-p-85x72.png", 
                              85, 72, 
                              [[[116, 148],[110, 214]],
                               [[348, 155],[348, 221]]]);    
  }
  Volf.prototype.drawImage = function (pos0, pos1) {
    this.volfBody.drawImage(pos0, 0);
    this.basket.drawImage(pos0, pos1);
  }
  Volf.prototype.drawImageAll = function () {
    this.volfBody.drawImage(0, 0);
    this.volfBody.drawImage(1, 0);
    this.basket.drawImage(0, 0);
    this.basket.drawImage(0, 1);
    this.basket.drawImage(1, 0);
    this.basket.drawImage(1, 1);
  }

  var volf = new Volf();

  volf.drawImageAll();

  // обработчик кнопок управления
  var bottonsControl = document.querySelectorAll('.gameControl');
  for(var i=0; i<bottonsControl.length; i++){

    bottonsControl[i].addEventListener('click', function(event){
      var bottonControl = event.target;
      var pos = bottonControl.getAttribute('data-control').split('-');

      //очистка экрана
      ctx.clearRect(0, 0, gameScreenWidth, gameScreenHeight);

      // прорисовка фигур
      volf.drawImage(pos[0], pos[1]);
    });
  }

  var testBl = document.getElementById('testBlock');
  // testBl.appendChild(imgBasket.dom);
}());
