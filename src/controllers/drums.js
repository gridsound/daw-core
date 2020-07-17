"use strict";

DAWCore.controllers.drums = class {
	constructor( fns ) {
		this.data = {};
		this.on = GSUtils.mapCallbacks( [
			"addDrum",
			"removeDrum",
			"changeDrum",
			"addDrumcut",
			"removeDrumcut",
		], fns.dataCallbacks );
		this._drumsCrud = GSUtils.createUpdateDelete.bind( null, this.data,
			this._addDrum.bind( this ),
			this._changeDrum.bind( this ),
			this._deleteDrum.bind( this ) );
		Object.freeze( this );
	}
	change( obj ) {
		this._drumsCrud( obj );
	}
	clear() {
		Object.keys( this.data ).forEach( this._deleteDrum, this );
	}

	// .........................................................................
	_addDrum( id, obj ) {
		const cpy = { ...obj };

		this.data[ id ] = cpy;
		if ( "gain" in cpy ) {
			this.on.addDrum( id, cpy );
			this._changeDrum( id, cpy );
		} else {
			this.on.addDrumcut( id, cpy );
		}
	}
	_deleteDrum( id ) {
		const fn = "gain" in this.data[ id ]
				? this.on.removeDrum
				: this.on.removeDrumcut;

		delete this.data[ id ];
		fn( id );
	}
	_changeDrum( id, obj ) {
		this._changeDrumProp( id, "detune", obj.detune );
		this._changeDrumProp( id, "gain", obj.gain );
		this._changeDrumProp( id, "pan", obj.pan );
	}
	_changeDrumProp( id, prop, val ) {
		if ( val !== undefined ) {
			this.data[ id ][ prop ] = val;
			this.on.changeDrum( id, prop, val );
		}
	}
};

Object.freeze( DAWCore.controllers.drums );
