var ctx;
var shipX=0, shipY=30;
var shipRotation = 0;
var shipImg;
var shipVelocity = 200;
var deltaTime = 1/60;
var shipRotateVel = 3;

var player = {
	velocity: 200.0,
	X: 320,
	Y: 400,
	img: new Image(),
	imgSrc: 'images/playerShip.png'
}

var shot = {
	velocity: 250.0,
	X: 0,
	Y: 0,
	img: new Image(),
	imgSrc: 'images/playerShot.phg'
}

var fps = 0;
var frames = 0;
var time = 0;
var acumDelta = 0;
var dateAux;

var KeyLeftPreshed = false;
var KeyRightPreshed = false;
var KeyUpPreshed = false;
var KeyDownPreshed = false;

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
	shipImg = new Image();
	shipImg.src = 'images/ovni.png';
	shipImg.onload = function ()
	{
		player.img.src = player.imgSrc;
		player.img.onload = function ()
		{
			//setInterval( function(){ Update(); Draw();}, deltaTime*1000 /*60fps*/);
			requestAnimationFrame(Loop);
		}
	}
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
	ctx.strokeRect(0, 0, 640, 480);
	
	DrawBg();
	DrawShip();
	DrawPlayer();
	
	// fps:
	ctx.font="12px Arial";
	ctx.fillText("FPS=" + fps, 10, 12);
	ctx.fillText("frames=" + frames, 10, 18);
}

function DrawBg ()
{
	var lGrad = ctx.createLinearGradient(320, 0, 320, 640); // dirección del gradiente
	lGrad.addColorStop(0, 'black');
	lGrad.addColorStop(1, '#5498d1');
	ctx.fillStyle = lGrad;
	ctx.fillRect(0, 0, 640, 480);
	
	// estrellas
	ctx.fillStyle = 'white';
	
	ctx.beginPath();
	ctx.arc(55, 58, 3, 0, Math.PI*2, false);
	ctx.fill();
	
	ctx.beginPath();
	ctx.arc(227, 128, 2, 0, Math.PI*2, false);
	ctx.fill();
}

function DrawShip ()
{
	// con rotación:
	ctx.save();
	ctx.translate(shipX, shipY);
	ctx.rotate(shipRotation);
	var centImgX = -shipImg.width/2;
	var centImgY = -shipImg.height/2;
	ctx.drawImage(shipImg, centImgX, centImgY);
	ctx.restore();
	shipRotation += shipRotateVel * deltaTime;
	
	// sin rotación:
	//ctx.drawImage(shipImg, shipX, shipY);
}

function DrawPlayer ()
{
	ctx.drawImage(player.img, player.X, player.Y);
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

	shipX += shipVelocity * deltaTime;
	shipY += Math.sin(shipX * deltaTime) * shipVelocity / 100;
	
	if (shipX > canvas.width + shipImg.width)
	{
		shipY = Math.floor((Math.random()*100)+10);
		shipX = -shipImg.width;
	}
	
	if (KeyLeftPreshed)
		player.X -= player.velocity * deltaTime;
	if (KeyRightPreshed)
		player.X += player.velocity * deltaTime;
	if (KeyUpPreshed)
		player.Y -= player.velocity * deltaTime;
	if (KeyDownPreshed)
		player.Y += player.velocity * deltaTime;
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
	}
}

function OnMouseDown (e)
{
	//alert(e.pageX + ", " + e.pageY);
}