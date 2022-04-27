"use strict";

DAWCore.controllers.keys = class {
	on = null;
	data = {};
	#keysCrud = DAWCore.utils.createUpdateDelete.bind( null, this.data,
		this.#addKey.bind( this ),
		this.#updateKey.bind( this ),
		this.#deleteKey.bind( this ) );
	static #keyProps = Object.freeze( [
		"key",
		"when",
		"duration",
		"gain",
		"gainLFOAmp",
		"gainLFOSpeed",
		"pan",
		"lowpass",
		"highpass",
		"selected",
		"prev",
		"next",
	] );

	constructor( fns ) {
		this.on = DAWCore.utils.mapCallbacks( [
			"addKey",
			"removeKey",
			"changeKeyProp",
		], fns.dataCallbacks );
		Object.freeze( this );
	}

	// .........................................................................
	clear() {
		Object.keys( this.data ).forEach( this.#deleteKey, this );
	}
	change( keysObj ) {
		this.#keysCrud( keysObj );
	}

	// .........................................................................
	#addKey( id, obj ) {
		const key = { ...obj };

		this.data[ id ] = key;
		this.on.addKey( id, key );
		this.#updateKey( id, key );
	}
	#deleteKey( id ) {
		delete this.data[ id ];
		this.on.removeKey( id );
	}
	#updateKey( id, obj ) {
		DAWCore.controllers.keys.#keyProps.forEach(
			DAWCore.controllers.keys.#setProp.bind( null,
				this.data[ id ],
				this.on.changeKeyProp.bind( null, id ),
				obj
			)
		);
	}
	static #setProp( data, cb, obj, prop ) {
		const val = obj[ prop ];

		if ( val !== undefined ) {
			data[ prop ] = val;
			cb( prop, val );
		}
	}
};

Object.freeze( DAWCore.controllers.keys );
