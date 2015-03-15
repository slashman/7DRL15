/*===================================================
				 7DRL15 Source Code
				
			By Camilo Ramírez (Jucarave)
			
					  2015
===================================================*/

function Underworld(){
	this.size = vec2(355, 200);
	
	this.GL = new WebGL(this.size, $$("divGame"));
	this.UI = new UI(this.size, $$("divGame"));
	
	this.player = new PlayerStats();
	this.inventory = new Inventory(10);
	this.console = new Console(10, 10, 300, this);
	this.font = '10px "Courier"';
	
	this.scene = null;
	this.map = null;
	this.maps = [];
	this.keys = [];
	this.mouse = vec3(0.0, 0.0, 0);
	this.mouseMovement = {x: -10000, y: -10000};
	this.images = {};
	this.music = {};
	this.textures = {wall: [], floor: [], ceil: []};
	this.objectTex = {};
	this.models = {};
	this.protection = 0;
	this.dropItem = false;
	
	this.fps = (1000 / 30) << 0;
	this.lastT = 0;
	this.numberFrames = 0;
	this.firstFrame = Date.now();
	
	this.loadImages();
	this.loadMusic();
	this.loadTextures();
	
	this.create3DObjects();
	AnimatedTexture.init(this.GL.ctx);
}

Underworld.prototype.create3DObjects = function(){
	this.door = ObjectFactory.door(vec3(0.5,0.75,0.1), vec2(1.0,1.0), this.GL.ctx, false);
	this.doorW = ObjectFactory.doorWall(vec3(1.0,1.0,1.0), vec2(1.0,1.0), this.GL.ctx);
	this.doorC = ObjectFactory.cube(vec3(1.0,1.0,0.1), vec2(1.0,1.0), this.GL.ctx, true);
	
	this.billboard = ObjectFactory.billboard(vec3(1.0,1.0,0.0), vec2(1.0,1.0), this.GL.ctx);
	
	this.slope = ObjectFactory.slope(vec3(1.0,1.0,1.0), vec2(1.0, 1.0), this.GL.ctx);
};

Underworld.prototype.loadMusic = function(){
	//this.music.title = this.GL.loadAudio(cp + "ogg/Britannian_music.ogg?version=" + version, true);
	//this.music.britannian = this.GL.loadAudio(cp + "ogg/Britannian_level.ogg?version=" + version, true);
};

Underworld.prototype.loadImages = function(){
	this.images.items_ui = this.GL.loadImage(cp + "img/itemsUI.png?version=" + version, false, 0, 0, {imgNum: 8, imgVNum: 2});
	this.images.spells_ui = this.GL.loadImage(cp + "img/spellsUI.png?version=" + version, false, 0, 0, {imgNum: 4, imgVNum: 4});
	this.images.titleScreen = this.GL.loadImage(cp + "img/titleScreen.png?version=" + version, false);
	this.images.selectClass = this.GL.loadImage(cp + "img/selectClass.png?version=" + version, false);
	this.images.inventory = this.GL.loadImage(cp + "img/inventory.png?version=" + version, false, 0, 0, {imgNum: 1, imgVNum: 2});
	this.images.inventoryDrop = this.GL.loadImage(cp + "img/inventoryDrop.png?version=" + version, false, 0, 0, {imgNum: 1, imgVNum: 2});
	this.images.inventorySelected = this.GL.loadImage(cp + "img/inventory_selected.png?version=" + version, false);
	this.images.scrollFont = this.GL.loadImage(cp + "img/scrollFontWhite.png?version=" + version, false);
};

Underworld.prototype.loadTextures = function(){
	this.textures = {wall: [null], floor: [null], ceil: [null], water: [null]};
	
	// No Texture
	var noTex = this.GL.loadImage(cp + "img/noTexture.png?version=" + version, true, 1, true);
	this.textures.wall.push(noTex);
	this.textures.floor.push(noTex);
	this.textures.ceil.push(noTex);
	
	// Walls
	this.textures.wall.push(this.GL.loadImage(cp + "img/texWall01.png?version=" + version, true, 1, true));
	this.textures.wall.push(this.GL.loadImage(cp + "img/texWall02.png?version=" + version, true, 2, true));
	
	// Floors
	this.textures.floor.push(this.GL.loadImage(cp + "img/texFloor01.png?version=" + version, true, 1, true));
	this.textures.floor.push(this.GL.loadImage(cp + "img/texFloor02.png?version=" + version, true, 2, true));
	this.textures.floor.push(this.GL.loadImage(cp + "img/texFloor03.png?version=" + version, true, 3, true));
	
	// Liquids
	this.textures.water.push(this.GL.loadImage(cp + "img/texWater01.png?version=" + version, true, 1, true));
	this.textures.water.push(this.GL.loadImage(cp + "img/texWater02.png?version=" + version, true, 2, true));
	this.textures.water.push(this.GL.loadImage(cp + "img/texLava01.png?version=" + version, true, 3, true));
	this.textures.water.push(this.GL.loadImage(cp + "img/texLava02.png?version=" + version, true, 4, true));
	
	// Ceilings
	this.textures.ceil.push(this.GL.loadImage(cp + "img/texCeil01.png?version=" + version, true, 1, true));
	
	// Items
	this.objectTex.items = this.GL.loadImage(cp + "img/texItems.png?version=" + version, true, 1, true);
	this.objectTex.items.buffers = AnimatedTexture.getTextureBufferCoords(8, 2, this.GL.ctx);
	
	this.objectTex.spells = this.GL.loadImage(cp + "img/texSpells.png?version=" + version, true, 1, true);
	this.objectTex.spells.buffers = AnimatedTexture.getTextureBufferCoords(4, 4, this.GL.ctx);
	
	// Magic Bolts
	this.objectTex.bolts = this.GL.loadImage(cp + "img/texBolts.png?version=" + version, true, 1, true);
	this.objectTex.bolts.buffers = AnimatedTexture.getTextureBufferCoords(4, 2, this.GL.ctx);
	
	// Enemies
	this.objectTex.bat_run = this.GL.loadImage(cp + "img/enemies/texBatRun.png?version=" + version, true, 1, true);
	this.objectTex.rat_run = this.GL.loadImage(cp + "img/enemies/texRatRun.png?version=" + version, true, 2, true);
	this.objectTex.spider_run = this.GL.loadImage(cp + "img/enemies/texSpiderRun.png?version=" + version, true, 3, true);
	this.objectTex.troll_run = this.GL.loadImage(cp + "img/enemies/texTrollRun.png?version=" + version, true, 4, true);
	this.objectTex.gazer_run = this.GL.loadImage(cp + "img/enemies/texGazerRun.png?version=" + version, true, 5, true);
	this.objectTex.ghost_run = this.GL.loadImage(cp + "img/enemies/texGhostRun.png?version=" + version, true, 6, true);
	this.objectTex.headless_run = this.GL.loadImage(cp + "img/enemies/texHeadlessRun.png?version=" + version, true, 7, true);
	this.objectTex.orc_run = this.GL.loadImage(cp + "img/enemies/texOrcRun.png?version=" + version, true, 8, true);
	this.objectTex.reaper_run = this.GL.loadImage(cp + "img/enemies/texReaperRun.png?version=" + version, true, 9, true);
	this.objectTex.skeleton_run = this.GL.loadImage(cp + "img/enemies/texSkeletonRun.png?version=" + version, true, 10, true);
	
	this.objectTex.daemon_run = this.GL.loadImage(cp + "img/enemies/texDaemonRun.png?version=" + version, true, 10, true);
	this.objectTex.firelizard_run = this.GL.loadImage(cp + "img/enemies/texFirelizardRun.png?version=" + version, true, 10, true);
	this.objectTex.hydra_run = this.GL.loadImage(cp + "img/enemies/texHydraRun.png?version=" + version, true, 10, true);
	//this.objectTex.seaSerpent_run = this.GL.loadImage(cp + "img/enemies/texSeaSerpentRun.png?version=" + version, true, 10, true);
	this.objectTex.octopus_run = this.GL.loadImage(cp + "img/enemies/texOctopusRun.png?version=" + version, true, 10, true);
	this.objectTex.balron_run = this.GL.loadImage(cp + "img/enemies/texBalronRun.png?version=" + version, true, 10, true);
	this.objectTex.liche_run = this.GL.loadImage(cp + "img/enemies/texLicheRun.png?version=" + version, true, 10, true);
	this.objectTex.ghost_run = this.GL.loadImage(cp + "img/enemies/texGhostRun.png?version=" + version, true, 10, true);
	this.objectTex.gremlin_run = this.GL.loadImage(cp + "img/enemies/texGremlinRun.png?version=" + version, true, 10, true);
	//this.objectTex.dragon_run = this.GL.loadImage(cp + "img/enemies/texDragonRun.png?version=" + version, true, 10, true);
	this.objectTex.zorn_run = this.GL.loadImage(cp + "img/enemies/texZornRun.png?version=" + version, true, 10, true);
};

Underworld.prototype.postLoading = function(){
	this.console.createSpriteFont(this.images.scrollFont, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?,./", 6);
};

Underworld.prototype.stopMusic = function(){
	for (var i in this.music){
		var audio = this.music[i];
		
		if (audio.timeO){
			clearTimeout(audio.timeO);
		}else if (audio.isMusic && audio.source){
			audio.source.stop();
			audio.source = null;
		}
	}
};

Underworld.prototype.playMusic = function(musicCode){
	var audioF = this.music[musicCode];
	if (!audioF) return null;
	
	this.stopMusic();
	this.GL.playSound(audioF, true, true);
};

Underworld.prototype.getUI = function(){
	return this.UI.ctx;
};

Underworld.prototype.getTextureById = function(textureId, type){
	if (!this.textures[type][textureId]) textureId = 1;
	
	return this.textures[type][textureId];
};

Underworld.prototype.getObjectTexture = function(textureCode){
	if (!this.objectTex[textureCode]) throw "Invalid texture code: " + textureCode;
	
	return this.objectTex[textureCode];
};

Underworld.prototype.loadMap = function(map, depth, id){
	var game = this;
	if (id === undefined || !game.maps[id]){
		id = game.maps.length;
	
		game.map = new MapManager(game, id, map, depth);
		game.maps.push(game.map);
		game.scene = null;
	}else if (game.maps[id]){
		game.map = game.maps[id];
		game.scene = null;
	}
};

Underworld.prototype.printGreet = function(){
	// Shows a welcome message with the game instructions.
	this.console.addSFMessage("Welcome to 7DRL15 alpha test!");
	this.console.addSFMessage("Press WASD to move, Use the mouse to turn around");
	this.console.addSFMessage("Press E to interact and Click to attack");
	this.console.addSFMessage("Have fun!");
};

Underworld.prototype.loadGame = function(){
	var game = this;
	
	if (game.GL.areImagesReady()){
		game.postLoading();
		game.printGreet();
		
		game.scene = new TitleScreen(this);
		game.loop();
	}else{
		requestAnimFrame(function(){ game.loadGame(); });
	}
};

Underworld.prototype.addItem = function(item){
	return this.inventory.addItem(item);
};

Underworld.prototype.drawObject = function(object, texture){
	var camera = this.map.player;
	
	this.GL.drawObject(object, camera, texture);
};

Underworld.prototype.drawBlock = function(blockObject, texId){
	var camera = this.map.player;
	
	this.GL.drawObject(blockObject, camera, this.getTextureById(texId, "wall").texture);
};

Underworld.prototype.drawDoorWall = function(x, y, z, texId, vertical){
	var game = this;
	var camera = game.map.player;
	
	game.doorW.position.set(x, y, z);
	if (vertical) game.doorW.rotation.set(0,Math.PI_2,0); else game.doorW.rotation.set(0,0,0);
	game.GL.drawObject(game.doorW, camera, game.getTextureById(texId, "wall").texture);
};

Underworld.prototype.drawDoorCube = function(x, y, z, texId, vertical){
	var game = this;
	var camera = game.map.player;
	
	game.doorC.position.set(x, y, z);
	if (vertical) game.doorC.rotation.set(0,Math.PI_2,0); else game.doorC.rotation.set(0,0,0);
	game.GL.drawObject(game.doorC, camera, game.getTextureById(texId, "wall").texture);
};

Underworld.prototype.drawDoor = function(x, y, z, rotation, texId){
	var game = this;
	var camera = game.map.player;
	
	game.door.position.set(x, y, z);
	game.door.rotation.b = rotation;
	game.GL.drawObject(game.door, camera, game.objectTex[texId].texture);
};

Underworld.prototype.drawFloor = function(floorObject, texId, typeOf){
	var game = this;
	var camera = game.map.player;
	
	var ft = typeOf;
	game.GL.drawObject(floorObject, camera, game.getTextureById(texId, ft).texture);
};

Underworld.prototype.drawBillboard = function(position, texId, billboard){
	var game = this;
	var camera = game.map.player;
	if (!billboard) billboard = game.billboard;
	
	billboard.position.set(position);
	game.GL.drawObject(billboard, camera, game.objectTex[texId].texture);
};

Underworld.prototype.drawSlope = function(slopeObject, texId){
	var game = this;
	var camera = game.map.player;
	
	game.GL.drawObject(slopeObject, camera, game.getTextureById(texId, "floor").texture);
};

Underworld.prototype.drawUI = function(){
	var game = this;
	var player = game.map.player;
	var ps = this.player;
	if (!player) return;
	
	var ctx = game.UI.ctx;
	
	// Draw health bar
	var hp = ps.hp / ps.mHP;
	ctx.fillStyle = "rgb(122,0,0)";
	ctx.fillRect(8,8,80,4);
	ctx.fillStyle = "rgb(200,0,0)";
	ctx.fillRect(8,8,80 * hp,4);
	
	// Draw mana
	var mana = ps.mana / ps.mMana;
	ctx.fillStyle = "rgb(181,98,20)";
	ctx.fillRect(8,14,60,2);
	ctx.fillStyle = "rgb(255,138,28)";
	ctx.fillRect(8,14,60 * mana,2);
	
	// Draw Inventory
	if (this.dropItem)
		this.UI.drawSprite(this.images.inventoryDrop, 110, 6, 0);
	else
		this.UI.drawSprite(this.images.inventory, 110, 6, 0);
	
	for (var i=0,len=this.inventory.items.length;i<len;i++){
		var item = this.inventory.items[i];
		var spr = item.tex + '_ui';

		if (!this.dropItem && (item.type == 'weapon' || item.type == 'armour') && item.equipped)
			this.UI.drawSprite(this.images.inventorySelected, 110 + (22 * i), 6, 0);		
		this.UI.drawSprite(this.images[spr], 113 + (22 * i), 9, item.subImg);
	}
	this.UI.drawSprite(this.images.inventory, 110, 6, 1);
	
	// If the player is hurt draw a red screen
	if (player.hurt > 0.0){
		ctx.fillStyle = "rgba(255,0,0,0.5)";
		ctx.fillRect(0,0,ctx.width,ctx.height);
	}else if (this.protection > 0.0){	// If the player has protection then draw it slightly blue
		ctx.fillStyle = "rgba(40,40,255,0.2)";
		ctx.fillRect(0,0,ctx.width,ctx.height);
	}
	
	game.console.render(8, 130);
};

Underworld.prototype.addExperience = function(expPoints){
	this.player.addExperience(expPoints, this.console);
};

Underworld.prototype.checkInvControl = function(){
	var player = this.map.player;
	var ps = this.player;
	if (!player || player.destroyed) return;
	
	if (this.getKeyPressed(84)){
		if (!this.dropItem){
			this.console.addSFMessage('Select the item to drop');
			this.dropItem = true;
		}else if (this.dropItem){
			this.dropItem = false;
		}
	}
	
	for (var i=0;i<10;i++){
		if (this.getKeyPressed(49 + i)){
			var item = this.inventory.items[i];
			if (!item){
				if (this.dropItem){
					this.console.addSFMessage('No item');
					this.dropItem = false;
				}
				continue;
			}
			
			if (this.dropItem){
				var cleanPos = this.map.getNearestCleanItemTile(player.position.a, player.position.c);
				if (!cleanPos){
					this.console.addSFMessage('Can not drop it here');
					this.dropItem = false;
				}else{
					this.console.addSFMessage(item.name + ' dropped');
					cleanPos.a += 0.5;
					cleanPos.c += 0.5;
					
					console.log(cleanPos);
					var nIt = new Item(cleanPos, null, this.map);
					nIt.setItem(item);
					this.map.instances.push(nIt);
					
					this.inventory.dropItem(i);
					this.dropItem = false;
				}
				
				continue;
			}
			
			if (item.type == 'weapon'){
				this.console.addSFMessage(item.name + ' wielded');
				this.inventory.equipItem(i);
			}else if (item.type == 'armour'){
				this.console.addSFMessage(item.name + ' wore');
				this.inventory.equipItem(i);
			}
		}
	} 
	
	return;
	if (this.getKeyPressed(49)){ // 1: Use potion
		if (ps.potions > 0){
			if (ps.hp == ps.mHP){
				this.console.addSFMessage("Health is already at max");
				return;
			}
			
			ps.potions -= 1;
			ps.hp = Math.min(ps.mHP, ps.hp + 5);
			this.console.addSFMessage("Potion used");
		}else{
			this.console.addSFMessage("No more potions left.");
		}
	}else if (this.getKeyPressed(50)){	// 2: Use protection
		var ms = this.magicScrolls[0];
		if (ms > 0){
			this.magicScrolls[0] -= 1;
			
			var prob = Math.random();
			if (prob > ps.stats.dex){
				this.console.addSFMessage("The protection cast failed!");
			}else{
				this.protection = 400;
				this.console.addSFMessage("Protection!");
			}
		}else{
			this.console.addSFMessage("No more protection scrolls left.");
		}
	}
};

Underworld.prototype.globalLoop = function(){
	if (this.protection > 0){ this.protection -= 1; }
};

Underworld.prototype.loop = function(){
	var game = this;
	
	var now = Date.now();
	var dT = (now - game.lastT);
	
	// Limit the game to the base speed of the game
	if (dT > game.fps){
		game.lastT = now - (dT % game.fps);
		
		if (!game.GL.active){
			requestAnimFrame(function(){ game.loop(); }); 
			return;
		}
		
		if (this.map != null){
			var gl = game.GL.ctx;
			
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			game.UI.clear();
			
			game.globalLoop();
			game.checkInvControl();
			game.map.loop();
			
			game.drawUI();
		}
		
		if (this.scene != null){
			game.scene.loop();
		}
	}
	
	requestAnimFrame(function(){ game.loop(); });
};

Underworld.prototype.getKeyPressed = function(keyCode){
	if (this.keys[keyCode] == 1){
		this.keys[keyCode] = 2;
		return true;
	}
	
	return false;
};

Underworld.prototype.getMouseButtonPressed = function(){
	if (this.mouse.c == 1){
		this.mouse.c = 2;
		return true;
	}
	
	return false;
};

Underworld.prototype.getMouseMovement = function(){
	var ret = {x: this.mouseMovement.x, y: this.mouseMovement.y};
	this.mouseMovement = {x: -10000, y: -10000};
	
	return ret;
};

addEvent(window, "load", function(){
	var game = new Underworld();
	game.loadGame();
	
	addEvent(document, "keydown", function(e){
		if (window.event) e = window.event;
		
		if (e.keyCode == 8){
			e.preventDefault();
			e.cancelBubble = true;
		}
		
		if (game.keys[e.keyCode] == 2) return;
		game.keys[e.keyCode] = 1;
	});
	
	addEvent(document, "keyup", function(e){
		if (window.event) e = window.event;
		
		if (e.keyCode == 8){
			e.preventDefault();
			e.cancelBubble = true;
		}
		
		game.keys[e.keyCode] = 0;
	});
	
	var canvas = game.UI.canvas;
	addEvent(canvas, "mousedown", function(e){
		if (window.event) e = window.event;
		
		if (game.map != null)
			canvas.requestPointerLock();
		
		game.mouse.a = Math.round((e.clientX - canvas.offsetLeft) / game.UI.scale);
		game.mouse.b = Math.round((e.clientY - canvas.offsetTop) / game.UI.scale);
		
		if (game.mouse.c == 2) return;
		game.mouse.c = 1;
	});
	
	addEvent(canvas, "mouseup", function(e){
		if (window.event) e = window.event;
		
		game.mouse.a = Math.round((e.clientX - canvas.offsetLeft) / game.UI.scale);
		game.mouse.b = Math.round((e.clientY - canvas.offsetTop) / game.UI.scale);
		game.mouse.c = 0;
	});
	
	addEvent(canvas, "mousemove", function(e){
		if (window.event) e = window.event;
		
		game.mouse.a = Math.round((e.clientX - canvas.offsetLeft) / game.UI.scale);
		game.mouse.b = Math.round((e.clientY - canvas.offsetTop) / game.UI.scale);
	});
	
	addEvent(window, "focus", function(){
		game.firstFrame = Date.now();
		game.numberFrames = 0;
	});
	
	addEvent(window, "resize", function(){
		var scale = $$("divGame").offsetHeight / game.size.b;
		var canvas = game.GL.canvas;
		
		canvas = game.UI.canvas;
		game.UI.scale = canvas.offsetHeight / canvas.height;
	});
	
	var moveCallback = function(e){
		game.mouseMovement.x = e.movementX ||
						e.mozMovementX ||
						e.webkitMovementX ||
						0;
						
		game.mouseMovement.y = e.movementY ||
						e.mozMovementY ||
						e.webkitMovementY ||
						0;
	};
	
	var pointerlockchange = function(e){
		if (document.pointerLockElement === canvas ||
			document.mozPointerLockElement === canvas ||
			document.webkitPointerLockElement === canvas){
				
			addEvent(document, "mousemove", moveCallback);
		}else{
			document.removeEventListener("mousemove", moveCallback);
			game.mouseMovement = {x: -10000, y: -10000};
		}
	};
	
	addEvent(document, "pointerlockchange", pointerlockchange);
	addEvent(document, "mozpointerlockchange", pointerlockchange);
	addEvent(document, "webkitpointerlockchange", pointerlockchange);
});
