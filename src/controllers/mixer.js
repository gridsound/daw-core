"use strict";

DAWCore.controllers.mixer = class {
	on = null;
	data = Object.freeze( { channels: {} } );
	#chansCrud = DAWCore.utils.createUpdateDelete.bind( null, this.data.channels,
		this.#addChannel.bind( this ),
		this.#updateChannel.bind( this ),
		this.#deleteChannel.bind( this ) );

	constructor( fns ) {
		this.on = DAWCore.utils.mapCallbacks( [
			"addChannel",
			"removeChannel",
			"toggleChannel",
			"renameChannel",
			"reorderChannel",
			"redirectChannel",
			"changePanChannel",
			"changeGainChannel",
		], fns.dataCallbacks );
		Object.freeze( this );
	}

	// .........................................................................
	clear() {
		Object.keys( this.data.channels ).forEach( id => {
			if ( id !== "main" ) {
				this.#deleteChannel( id );
			}
		} );
	}
	recall() {
		const ent = Object.entries( this.data.channels );

		ent.forEach( kv => this.#deleteChannel( kv[ 0 ] ) );
		ent.forEach( kv => this.#addChannel( kv[ 0 ], kv[ 1 ] ) );
	}
	change( { channels } ) {
		this.#chansCrud( channels );
	}

	// .........................................................................
	#addChannel( id, obj ) {
		this.data.channels[ id ] = {};
		this.on.addChannel( id, obj );
		this.#updateChannel( id, obj );
	}
	#deleteChannel( id ) {
		delete this.data.channels[ id ];
		this.on.removeChannel( id );
	}
	#updateChannel( id, obj ) {
		Object.assign( this.data.channels[ id ], obj );
		this.#updateChannel2( id, obj.name, this.on.renameChannel );
		this.#updateChannel2( id, obj.order, this.on.reorderChannel );
		this.#updateChannel2( id, obj.toggle, this.on.toggleChannel );
		this.#updateChannel2( id, obj.dest, this.on.redirectChannel );
		this.#updateChannel2( id, obj.pan, this.on.changePanChannel );
		this.#updateChannel2( id, obj.gain, this.on.changeGainChannel );
	}
	#updateChannel2( id, val, fn ) {
		if ( val !== undefined ) {
			fn( id, val );
		}
	}
};

Object.freeze( DAWCore.controllers.mixer );
