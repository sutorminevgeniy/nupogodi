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
  Figura.prototype.draw = function (pos0, pos1, x, y, a) {
    var that = this;

    var drawImg = function (){
      ctx.save();
      // поворот вокруг центра рисунка
      ctx.translate(x + that.width / 2, y + that.height / 2);
      ctx.rotate(a);
      // прорисовка изображения
      ctx.drawImage(that.dom, 
                  that.width*pos0, that.height*pos1, 
                  that.width, that.height, 
                  0 - that.width / 2, - that.height / 2, 
                  that.width, that.height);
      ctx.restore();
    }
  
    if(that.loaded){
      drawImg();
    } else {
      that.dom.addEventListener('load', function (){
        drawImg();
      });
    }
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

  function Egg(){
    this.egg = new Figura("img/egg-19x19.png", 
                              19, 19, 
                              [[[166, 152]],
                               [[287, 152]]]);
  }
  Egg.prototype.drawImage = function (pos0, pos1) {
    this.egg.drawImage(pos0, pos1);
  }
  Egg.prototype.drawImageAll = function () {
    this.egg.draw(0, 0, 32, 107, 0.6);
    this.egg.draw(0, 0, 49, 117, 1.2);
    this.egg.draw(0, 0, 65, 128, 3);
    this.egg.draw(0, 0, 79, 137, 4.5);
    this.egg.draw(0, 0, 94, 145, 5.9);

    this.egg.draw(0, 0, gameScreenWidth - 22 - 32, 107, -0.6);
    this.egg.draw(0, 0, gameScreenWidth - 22 - 49, 117, -1.2);
    this.egg.draw(0, 0, gameScreenWidth - 22 - 65, 128, -3);
    this.egg.draw(0, 0, gameScreenWidth - 22 - 79, 137, -4.5);
    this.egg.draw(0, 0, gameScreenWidth - 22 - 94, 145, -5.9);
  }

  var egg = new Egg();
  egg.drawImageAll();

  // обработчик кнопок управления
  var bottonsControl = document.querySelectorAll('.gameControl');
  for(var i=0; i<bottonsControl.length; i++){

    bottonsControl[i].addEventListener('mousedown', function(event){
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
