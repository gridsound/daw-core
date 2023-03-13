"use strict";

DAWCoreControllers.mixer = class {
	on = null;
	data = Object.freeze( { channels: {}, effects: {} } );
	#chansCrud = DAWCoreUtils.$createUpdateDelete.bind( null, this.data.channels,
		this.#addChannel.bind( this ),
		this.#updateChannel.bind( this ),
		this.#deleteChannel.bind( this ) );
	#effectsCrud = DAWCoreUtils.$createUpdateDelete.bind( null, this.data.effects,
		this.#addEffect.bind( this ),
		this.#updateEffect.bind( this ),
		this.#deleteEffect.bind( this ) );

	constructor( fns ) {
		this.on = DAWCoreUtils.$mapCallbacks( [
			"addChannel",
			"removeChannel",
			"toggleChannel",
			"renameChannel",
			"reorderChannel",
			"redirectChannel",
			"changePanChannel",
			"changeGainChannel",
			"addEffect",
			"updateEffect",
			"removeEffect",
		], fns.dataCallbacks );
		Object.freeze( this );
	}

	// .........................................................................
	clear() {
		Object.keys( this.data.effects ).forEach( id => this.#deleteEffect( id ) );
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
	change( obj ) {
		this.#chansCrud( obj.channels );
		this.#effectsCrud( obj.effects );
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

	// .........................................................................
	#addEffect( id, obj ) {
		this.data.effects[ id ] = {};
		this.on.addEffect( obj.dest, id, obj );
		this.#updateEffect( id, obj );
	}
	#deleteEffect( id ) {
		const dest = this.data.effects[ id ].dest;

		delete this.data.effects[ id ];
		if ( dest in this.data.channels ) {
			this.on.removeEffect( dest, id );
		}
	}
	#updateEffect( id, obj ) {
		DAWCoreUtils.$deepAssign( this.data.effects[ id ], obj );
		this.on.updateEffect( this.data.effects[ id ].dest, id, obj );
	}
};

Object.freeze( DAWCoreControllers.mixer );
