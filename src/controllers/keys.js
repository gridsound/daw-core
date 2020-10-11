"use strict";

DAWCore.controllers.keys = class {
	constructor( fns ) {
		this.data = {};
		this.on = GSUtils.mapCallbacks( [
			"addKey",
			"removeKey",
			"changeKeyProp",
		], fns.dataCallbacks );
		this._keysCrud = GSUtils.createUpdateDelete.bind( null, this.data,
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
		const dataKey = this.data[ id ],
			cb = this.on.changeKeyProp.bind( null, id );

		this._setProp( dataKey, cb, "key", obj.key );
		this._setProp( dataKey, cb, "when", obj.when );
		this._setProp( dataKey, cb, "duration", obj.duration );
		this._setProp( dataKey, cb, "attack", obj.attack );
		this._setProp( dataKey, cb, "release", obj.release );
		this._setProp( dataKey, cb, "gain", obj.gain );
		this._setProp( dataKey, cb, "pan", obj.pan );
		this._setProp( dataKey, cb, "lowpass", obj.lowpass );
		this._setProp( dataKey, cb, "highpass", obj.highpass );
		this._setProp( dataKey, cb, "selected", obj.selected );
		this._setProp( dataKey, cb, "prev", obj.prev );
		this._setProp( dataKey, cb, "next", obj.next );
	}
	_setProp( data, cb, prop, val ) {
		if ( val !== undefined ) {
			data[ prop ] = val;
			cb( prop, val );
		}
	}
};

Object.freeze( DAWCore.controllers.keys );
