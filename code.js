var screenWidth = 640;
var screenHeight = 480;

var ctx;
var deltaTime = 1/60;

var enemyRotation = 0;
var enemyVelocity = 200;
var enemyRotateVel = 3;
var shotVelocity = 350.0;
var timeSinceLastShot = 0;

var audioShot;

var player = {
	velocity: 220.0,
	X: 320,
	Y: 400,
	img: new Image(),
	imgSrc: 'images/playerShip.png',
	rateOfFire: 0.2,
	Draw: function()
	{
		ctx.drawImage(this.img, this.X, this.Y);
	}
}

var shotImg = new Image();
var shotImgSrc = 'images/playerShot.png';
var shot = {
	velocity: shotVelocity,
	X: 0,
	Y: 0,
	img: shotImg,
	Draw: function()
	{
		ctx.drawImage(this.img, this.X, this.Y);
	}
}
var shots = new Array();

var enemyImg = new Image();
var enemyImgSrc = 'img/ovni.png';
var enemy = {
	velocity: enemyVelocity,
	rotation: enemyRotation,
	rotVel: enemyRotateVel,
	X: 0,
	Y: 40,
	shotVelocity: 300.0,
	timeSinceLastShot: 0,
	rateOfFire: 0.6,
	img: enemyImg,
	Draw: function()
	{
		// con rotación:
		/*ctx.save();
		ctx.translate(this.X, this.Y);
		ctx.rotate(this.rotation);
		var centImgX = -this.img.width/2;
		var centImgY = -this.img.height/2;
		ctx.drawImage(this.img, centImgX, centImgY);
		ctx.restore();
		this.rotation += this.rotVel * deltaTime;*/
		
		// sin rotación:
		ctx.drawImage(this.img, this.X, this.Y);
	},
	Update: function()
	{
		this.X += this.velocity * deltaTime;
		this.Y += Math.sin(this.X * deltaTime) * this.velocity / 100;
		
		if (this.X > canvas.width + this.img.width)
		{
			this.X = Math.floor((Math.random()*100)+10);
			this.X = -this.img.width;
		}
		
		// shot!
		this.timeSinceLastShot += deltaTime;
		if (this.timeSinceLastShot >= this.rateOfFire)
		{
			shot = {
				velocity: shotVelocity,
				X: this.X + this.img.width / 2,
				Y: this.Y + this.img.height / 2,
				img: enemyShotImg,
				Draw: function()
				{
					ctx.drawImage(this.img, this.X, this.Y);
				}
			}
			enemiesShots.push(shot);
			this.timeSinceLastShot = 0;
		}
	}
}
var enemies = new Array();
enemies.push(enemy);

var enemyShotImg = new Image();
var enemyShotImgSrc = 'images/enemyShot.png';
var enemiesShots = new Array();

var fps = 0;
var frames = 0;
var time = 0;
var acumDelta = 0;
var dateAux;

var KeyLeftPreshed = false;
var KeyRightPreshed = false;
var KeyUpPreshed = false;
var KeyDownPreshed = false;
var SpacePreshed = false;

function Init ()
{
	window.requestAnimationFrame = (function (evt) {
		return window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 17);
			};
	}) ();
	var canvas = document.getElementById('canvas');
	
	// ejemplos canvas: http://www.w3schools.com/tags/ref_canvas.asp
	
	if (canvas.getContext)
	{
		ctx = canvas.getContext('2d');
		
		LoadResources();
	}
	
	document.addEventListener('keydown', OnKeyDown, false);
	document.addEventListener('keyup', OnKeyUp, false);
	document.addEventListener('mousedown', OnMouseDown, false);
}

function LoadResources ()
{
	enemyImg.src = 'images/ovni.png';
	enemyImg.onload = function ()
	{
		player.img.src = player.imgSrc;
		player.img.onload = function ()
		{
			shotImg.src = shotImgSrc;
			shotImg.onload = function()
			{
				enemyShotImg.src = enemyShotImgSrc;
				enemyShotImg.onload = function(){}
				//setInterval( function(){ Update(); Draw();}, deltaTime*1000 /*60fps*/);
				requestAnimationFrame(Loop);
			}
		}
	}
	
	// audio resources
	audioShot = document.getElementById('AudioShot');
}

function Loop ()
{
	requestAnimationFrame(Loop);
	Update();
	Draw();
}

function Draw ()
{
	// rectángulo negro
	ctx.strokeRect(0, 0, screenWidth, screenHeight);
	
	// fondo
	DrawBg();
	// disparos del jugador
	for (i=0; i<shots.length; i++)
		shots[i].Draw();
	// disparos de los enemigos
	for (i=0; i<enemiesShots.length; i++)
		enemiesShots[i].Draw();
	// enemigos
	for (i=0; i<enemies.length; i++)
		enemies[i].Draw();
	// nave del jugador
	player.Draw();
	
	// fps:
	ctx.font="12px Arial";
	ctx.fillText("FPS=" + fps, 10, 12);
	ctx.fillText("frames=" + frames, 10, 24);
}

function DrawBg ()
{
	var lGrad = ctx.createLinearGradient(320, 0, 320, screenWidth); // dirección del gradiente
	lGrad.addColorStop(0, '#040311');
	lGrad.addColorStop(1, '#2d699c');
	ctx.fillStyle = lGrad;
	ctx.fillRect(0, 0, screenWidth, screenHeight);
	
	// estrellas
	ctx.fillStyle = 'white';
	
	ctx.beginPath();
	ctx.arc(55, 58, 3, 0, Math.PI*2, false);
	ctx.fill();
	
	ctx.beginPath();
	ctx.arc(227, 128, 2, 0, Math.PI*2, false);
	ctx.fill();
	
	ctx.beginPath();
	ctx.arc(440, 108, 4, 0, Math.PI*2, false);
	ctx.fill();
}

function Update ()
{
	var now = Date.now();
	var timeAux = now - time;
	if (timeAux >= 1000)
		timeAux = 0;
	time = now;
	frames++;
	acumDelta += timeAux;
	if (acumDelta >= 1000)
	{
		fps = frames;
		frames = 0;
		acumDelta -= 1000;
	}
	//deltaTime = timeAux / 1000;

	// enemies update
	for (i=0; i<enemies.length; i++)
		enemies[i].Update();
	
	if (KeyLeftPreshed && player.X >= 0)
		player.X -= player.velocity * deltaTime;
	if (KeyRightPreshed && player.X <= canvas.width - player.img.width)
		player.X += player.velocity * deltaTime;
	if (KeyUpPreshed)
		player.Y -= player.velocity * deltaTime;
	if (KeyDownPreshed)
		player.Y += player.velocity * deltaTime;
	if (SpacePreshed && timeSinceLastShot >= player.rateOfFire)
	{
		// shot!
		shot = {
			velocity: shotVelocity,
			X: player.X + player.img.width / 2,
			Y: player.Y + player.img.height / 2,
			img: shotImg,
			Draw: function()
			{
				ctx.drawImage(this.img, this.X, this.Y);
			}
		}
		shots.push(shot);
		timeSinceLastShot = 0;
		audioShot.play();
	}
	
	timeSinceLastShot += deltaTime;
	
	// update the shots:
	for (i=0; i<shots.length; i++)
	{
		shots[i].Y -= shotVelocity * deltaTime;
		if (shots[i].Y <= -12)
			shots.shift();
	}
	// disparos de los enemigos
	for (i=0; i<enemiesShots.length; i++)
	{
		enemiesShots[i].Y += enemiesShots[i].velocity * deltaTime;
		if (enemiesShots[i].Y >= screenHeight)
			enemiesShots.shift();
	}
	
	// enemies vs shots collisions:
	for (i=0; i<enemies.length; i++)
		for (j=0; j<shots.length; j++)
		{
			if ((shots[j].X > enemies[i].X) &&
				(shots[j].X < (enemies[i].X + enemies[i].img.width)) &&
				(shots[j].Y > enemies[i].Y) &&
				(shots[j].Y < (enemies[i].Y + enemies[i].img.height)) )
			{
				shots.splice(j, 1);
				j--;
				enemies.splice(i, 1);
				i--;
			}
		}
}

function Collision(a,b)
{
	var collision = false;
	if (b.x + b.width >= a.x && b.x < a.x +a.width)
	{
		if (b.y + b.height >= a.y && b.y < a.y + a.height)
		{
			collision = true;
		}
	}
	if (b.x <= a.x && b.x + b.width >= a.x + a.width)
	{
		if (b.y <= a.y && b.y + b.height >= a.y + a.height)
		{
			collision = true;
		}
	}
	if (a.x <= b.x && a.x + a.width >= b.x + b.width)
	{
		if (a.y <= b.y && a.y + a.height >= b.y + b.height)
		{
			collision = true;
		}
	}
	return collision;
}

function OnKeyDown (e)
{
	//alert( e.keyCode );
	switch (e.keyCode)
	{
		case 37: KeyLeftPreshed = true;	break;
		case 39: KeyRightPreshed = true;break;
		case 38: KeyUpPreshed = true;	break;
		case 40: KeyDownPreshed = true;	break;
		case 32: SpacePreshed = true;	break; // espacio
	}
}

function OnKeyUp (e)
{
	switch (e.keyCode)
	{
		case 37: KeyLeftPreshed = false;	break;
		case 39: KeyRightPreshed = false;	break;
		case 38: KeyUpPreshed = false;		break;
		case 40: KeyDownPreshed = false;	break;
		case 32: SpacePreshed = false;		break; // espacio
	}
}

function OnMouseDown (e)
{
	//alert(e.pageX + ", " + e.pageY);
}