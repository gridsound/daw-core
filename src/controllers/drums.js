"use strict";

DAWCore.controllers.drums = class {
	on = null;
	data = {};
	#drumsCrud = DAWCore.utils.createUpdateDelete.bind( null, this.data,
		this.#addDrum.bind( this ),
		this.#changeDrum.bind( this ),
		this.#deleteDrum.bind( this ) );

	constructor( fns ) {
		this.on = DAWCore.utils.mapCallbacks( [
			"addDrum",
			"removeDrum",
			"changeDrum",
			"addDrumcut",
			"removeDrumcut",
		], fns.dataCallbacks );
		Object.freeze( this );
	}
	change( obj ) {
		this.#drumsCrud( obj );
	}
	clear() {
		Object.keys( this.data ).forEach( this.#deleteDrum, this );
	}

	// .........................................................................
	#addDrum( id, obj ) {
		const cpy = { ...obj };

		this.data[ id ] = cpy;
		if ( "gain" in cpy ) {
			this.on.addDrum( id, cpy );
			this.#changeDrum( id, cpy );
		} else {
			this.on.addDrumcut( id, cpy );
		}
	}
	#deleteDrum( id ) {
		const fn = "gain" in this.data[ id ]
			? this.on.removeDrum
			: this.on.removeDrumcut;

		delete this.data[ id ];
		fn( id );
	}
	#changeDrum( id, obj ) {
		this.#changeDrumProp( id, "detune", obj.detune );
		this.#changeDrumProp( id, "gain", obj.gain );
		this.#changeDrumProp( id, "pan", obj.pan );
	}
	#changeDrumProp( id, prop, val ) {
		if ( val !== undefined ) {
			this.data[ id ][ prop ] = val;
			this.on.changeDrum( id, prop, val );
		}
	}
};

Object.freeze( DAWCore.controllers.drums );
