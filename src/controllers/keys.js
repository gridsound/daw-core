"use strict";

DAWCoreControllers.keys = class {
	on = null;
	data = {};
	#keysCrud = DAWCoreUtils.$createUpdateDelete.bind( null, this.data,
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
		this.on = DAWCoreUtils.$mapCallbacks( [
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
		DAWCoreControllers.keys.#keyProps.forEach(
			DAWCoreControllers.keys.#setProp.bind( null,
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

Object.freeze( DAWCoreControllers.keys );
