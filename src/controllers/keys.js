"use strict";

DAWCore.controllers.keys = class {
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
		this.data = {};
		this.on = DAWCore.utils.mapCallbacks( [
			"addKey",
			"removeKey",
			"changeKeyProp",
		], fns.dataCallbacks );
		this._keysCrud = DAWCore.utils.createUpdateDelete.bind( null, this.data,
			this._addKey.bind( this ),
			this._updateKey.bind( this ),
			this._deleteKey.bind( this ) );
		Object.freeze( this );
	}

	// .........................................................................
	clear() {
		Object.keys( this.data ).forEach( this._deleteKey, this );
	}
	change( keysObj ) {
		this._keysCrud( keysObj );
	}

	// .........................................................................
	_addKey( id, obj ) {
		const key = { ...obj };

		this.data[ id ] = key;
		this.on.addKey( id, key );
		this._updateKey( id, key );
	}
	_deleteKey( id ) {
		delete this.data[ id ];
		this.on.removeKey( id );
	}
	_updateKey( id, obj ) {
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
