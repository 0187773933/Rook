#!/usr/bin/env node
const process = require( "process" );
const path = require( "path" );
const global_package_path = process.argv[ 0 ].split( "/bin/node" )[ 0 ] + "/lib/node_modules";
const WebSocket = require( path.join( global_package_path ,  "ws" ) );

// bind( this ) does not like arrow functions btw ,
// you have too use old school function() {}

class RookPlayer {
	constructor( options = {} ) {
		this.player_name = options.player_name || this.getRandomID();
		this.game_options = {
			name: options.game_name || this.getRandomID() ,
			rookvalue: options.rookvalue || "10.5" ,
			rookfirsttrick: options.rookfirsttrick || "yes" ,
			trumpbeforekitty: options.trumpbeforekitty || "no" ,
			playto: options.playto || "500"
		}
		this.websocket_ready = false;
	}

	sleep( ms ) { return new Promise( resolve => setTimeout( resolve , ms ) ); }

	getRandomID() {
		function s4() {
			return Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 ).substring( 1 );
		}
		return s4() + "-" + s4() + "-" + s4();
	}

	connect() {
		return new Promise( function( resolve , reject ) {
			try {
				this.ws = null;
				this.websocket_ready = false;
				this.ws = new WebSocket( "ws://155.138.203.72:9300" );
				this.ws.on( "message" , this.websocketOnMessage );
				this.ws.on( "close" , this.websocketOnClose );
				this.ws.on( "open" , () => {
					console.log( "WebSocket Connected" );
					this.websocket_ready = true;
					resolve();
					return;
				});
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
	}

	websocketOnMessage( data ) {
		if ( !data ) { return };
		try { data = JSON.parse( data ); }
		catch( error ) { console.log( e ); return; }
		console.log( "" );
		console.log( data );
		if ( data[ "action" ] ) {
			if ( data[ "message" ] ) {
				if ( data[ "message" ] === "addgame" ) {
					if ( data[ "data" ] ){
						this.active_game = data;
						console.log( this.active_game );
					}
				}
			}
		}
	}

	websocketOnClose() {
		setTimeout( this.connect , 1000 );
	}

	send( message_object ) {
		this.ws.send( JSON.stringify( message_object ) );
	}

	setName() {
		this.send({
			"action": "changename" ,
			"data": this.player_name
		});
	}

	newGame() {
		this.send({
			"action": "new" ,
			"data": this.game_options
		});
	}

	leaveGame() {
		this.send({
			"action": "leave" ,
			"data": ""
		});
	}

	sendChatMessage( chat_message ) {
		this.send({
			"action": "chat" ,
			"data": chat_message
		});
	}

	joinTeam( game_id , team_number ) {
		this.send({
			"action": "join" ,
			"data" : {
				"game": game_id ,
				"team": team_number
			}
		});
	}

	confirmBeginGame() {
		this.send({
			"action": "confirm" ,
			"data": "" ,
		});
	}

	layCard( suit , number ) {
		this.send({
			"action": "game" ,
			"data": {
				"command": "lay" ,
				"arguments": {
					"suit": suit ,
					"number": number
				}
			}
		});
	}

	passTurn() {
		this.send({
			"action": "game" ,
			"data": {
				"command": "bid" ,
				"arguments": "pass"
			}
		});
	}

	bidAmount( bid_amount ) {
		this.send({
			"action": "game" ,
			"data": {
				"command": "bid" ,
				"arguments": bid_amount
			}
		});
	}

	// kitty = [
	// { "suit": "Black" , "number": 1 } ,
	// { "suit": "Yellow" , "number": 2 } ,
	// { "suit": "Red" , "number": 3 } ,
	// { "suit": "Green" , "number": 4 } ,
	// { "suit": "Green" , "number": 5 } ,
	//]
	submitKitty( kitty , trump_color ) {
		this.send({
			"action": "game" ,
			"data": {
				"command": "kitty" ,
				"arguments": kitty ,
				"trumpcolor": trump_color
			}
		});
	}

	readyForNextGame( kitty , trump_color ) {
		this.send({
			"action": "game" ,
			"data": {
				"command": "nextgame" ,
				"arguments": "" ,
			}
		});
	}


}


( async	()=> {

	const Player1 = new RookPlayer();
	await Player1.connect();
	console.log( Player1 );
	Player1.newGame();
	await Player1.sleep( 2000 );
	Player1.joinTeam( Player1.game_options.name , "1" );

	const Player2 = new RookPlayer({ game_name: Player1.game_options.name });
	await Player2.connect();
	//Player2.newGame();
	await Player2.sleep( 2000 );
	Player2.joinTeam( Player1.active_game.id , "1" );

	// const Player3 = new RookPlayer({ game_name: Player1.game_options.name });
	// await Player3.connect();
	// //Player3.newGame();
	// await Player3.sleep( 2000 );
	// Player3.joinTeam( Player1.game_options.name , "2" );

	// const Player4 = new RookPlayer({ game_name: Player1.game_options.name });
	// await Player4.connect();
	// //Player4.newGame();
	// await Player4.sleep( 2000 );
	// Player4.joinTeam( Player1.game_options.name , "2" );

})();