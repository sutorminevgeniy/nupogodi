(function(){
  // инициализация canvas
  var canvas = document.getElementById('gameCanvas'),
      ctx = canvas.getContext('2d'),
      gameScreenWidth  = 544, 
      gameScreenHeight = 327; 
      canvas.width  = gameScreenWidth; 
      canvas.height = gameScreenHeight; 

  // базовый объект фигур
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

  // Объект для волка с карзиной
  function Volf(){
    this.volfBody = new Figura("img/wolf-98x152.png", 
                              98, 152, 
                              [[[166, 152]],
                               [[287, 152]]]);
    this.basket = new Figura("img/basket-p-85x72.png", 
                              85, 72, 
                              [[[116, 148],[110, 214]],
                               [[348, 155],[348, 221]]]);
    this.curPos = [0, 0]
  }
  Volf.prototype.setPos = function (pos) {
    for(var i = 0; i < pos.length; i++){
      this.curPos[i] = pos[i];
    }
  }
  Volf.prototype.drawImage = function () {
    this.volfBody.drawImage(this.curPos[0], 0);
    this.basket.drawImage(this.curPos[0], this.curPos[1]);
  }
  Volf.prototype.drawImageAll = function () {
    this.volfBody.drawImage(0, 0);
    this.volfBody.drawImage(1, 0);
    this.basket.drawImage(0, 0);
    this.basket.drawImage(0, 1);
    this.basket.drawImage(1, 0);
    this.basket.drawImage(1, 1);
  }

  // Объект для волка с падающих яиц
  function Egg(egg, pos){
    this.egg = egg;
    this.curPos = [0, 0, 0];
    this.curCoord = [0, 0, 0];

    this.curPos[1] = pos % 2;
    this.curPos[0] = (pos - this.curPos[1]) / 2;
    this.curCoord = [0, 0, 0];
    this.calculatePos();
  }
  Egg.prototype.calculatePos = function () {
    var coordPos = [[32, 107, 0.6],
                    [49, 117, 1.2],
                    [65, 128, 3],
                    [79, 137, 4.5],
                    [94, 145, 5.9]];
    var x = this.curPos[0], 
        y = this.curPos[1];

    this.curCoord[0] = ((gameScreenWidth - 22)*x) + ((1-2*x) * coordPos[this.curPos[2]][0]);
    this.curCoord[1] = (y*73) + coordPos[this.curPos[2]][1];
    this.curCoord[2] = (1-2*x) * coordPos[this.curPos[2]][2];
  }
  Egg.prototype.drawImage = function () {
    this.egg.draw(0, 0, this.curCoord[0], this.curCoord[1], this.curCoord[2]);
  }

  // Объект для волка с падающих яиц
  function Eggs(){
    this.egg = new Figura("img/egg-19x19.png", 
                              19, 19, 
                              [[[166, 152]],
                               [[287, 152]]]);
    this.eggs = [];
    this.numb = 0;
  }
  Eggs.prototype.addEgg = function () {
    // получение случайной позиции яца кроме предыдущей
    var numbArr = [0, 1, 2, 3],
        l = 3;
    if(this.eggs.length > 0){
      l = 2;
      numbArr.splice(this.numb, 1);
    }
    this.numb = numbArr[randomInteger(0, l)];
    var newEgg = new Egg(this.egg, this.numb);
    
    this.eggs.push(newEgg);
  }
  Eggs.prototype.deleteEgg = function (i) {
    this.eggs.splice(i, 1);
  }
  Eggs.prototype.increnent = function () {
    for(var i = (this.eggs.length - 1); i >= 0; i--){
      if(this.eggs[i].curPos[2] < 4){
        this.eggs[i].curPos[2]++;
        this.eggs[i].calculatePos();
      } else {
        this.deleteEgg(i);
      }
    }
    this.addEgg(i);
  }
  Eggs.prototype.drawImage = function () {
    for(var i = 0; i < this.eggs.length; i++){
      this.eggs[i].drawImage();
    }
  }
  Eggs.prototype.drawImageAll = function () {
    this.egg.draw(0, 0, 32, 107, 0.6);
    this.egg.draw(0, 0, 49, 117, 1.2);
    this.egg.draw(0, 0, 65, 128, 3);
    this.egg.draw(0, 0, 79, 137, 4.5);
    this.egg.draw(0, 0, 94, 145, 5.9);

    this.egg.draw(0, 0, 32, 107 + 73, 0.6);
    this.egg.draw(0, 0, 49, 117 + 73, 1.2);
    this.egg.draw(0, 0, 65, 128 + 73, 3);
    this.egg.draw(0, 0, 79, 137 + 73, 4.5);
    this.egg.draw(0, 0, 94, 145 + 73, 5.9);

    this.egg.draw(0, 0, gameScreenWidth - 22 - 32, 107, -0.6);
    this.egg.draw(0, 0, gameScreenWidth - 22 - 49, 117, -1.2);
    this.egg.draw(0, 0, gameScreenWidth - 22 - 65, 128, -3);
    this.egg.draw(0, 0, gameScreenWidth - 22 - 79, 137, -4.5);
    this.egg.draw(0, 0, gameScreenWidth - 22 - 94, 145, -5.9);

    this.egg.draw(0, 0, gameScreenWidth - 22 - 32, 107 + 73, -0.6);
    this.egg.draw(0, 0, gameScreenWidth - 22 - 49, 117 + 73, -1.2);
    this.egg.draw(0, 0, gameScreenWidth - 22 - 65, 128 + 73, -3);
    this.egg.draw(0, 0, gameScreenWidth - 22 - 79, 137 + 73, -4.5);
    this.egg.draw(0, 0, gameScreenWidth - 22 - 94, 145 + 73, -5.9);
  }

  var volf = new Volf();
  var eggs = new Eggs();
  volf.drawImageAll();
  eggs.drawImageAll();

  var speed = 50,
        step = 0;
  stepAnimation();

  function stepAnimation() {
    requestAnimationFrame(stepAnimation);

    //очистка экрана
    ctx.clearRect(0, 0, gameScreenWidth, gameScreenHeight);
    // рисование фигур
    volf.drawImage();
    eggs.drawImage();
    
    if(++step >= speed){
      step = 0;
      eggs.increnent();
    }
  }
  // обработчик кнопок управления
  var bottonsControl = document.querySelectorAll('.gameControl');
  for(var i=0; i<bottonsControl.length; i++){

    bottonsControl[i].addEventListener('mousedown', function(event){
      var bottonControl = event.target;
      var pos = bottonControl.getAttribute('data-control').split('-');

      // смена позиции волка
      volf.setPos(pos);
    });
  }

  var testBl = document.getElementById('testBlock');
  // testBl.appendChild(imgBasket.dom);
}());
