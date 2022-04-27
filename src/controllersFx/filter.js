"use strict";

DAWCore.controllersFx.filter = class {
	on = null;
	data = Object.seal( DAWCore.json.effects.filter() );

	constructor( fns ) {
		this.on = DAWCore.utils.mapCallbacks( [
			"type",
			"Q",
			"gain",
			"detune",
			"frequency",
			"drawCurve",
		], fns.dataCallbacks );
		Object.freeze( this );
	}

	recall() {
		this.on.type( this.data.type );
		this.on.Q( this.data.Q );
		this.on.gain( this.data.gain );
		this.on.detune( this.data.detune );
		this.on.frequency( this.data.frequency );
		this.on.drawCurve();
	}
	change( obj ) {
		this.#changeProp( "type", obj.type, this.on.type );
		this.#changeProp( "Q", obj.Q, this.on.Q );
		this.#changeProp( "gain", obj.gain, this.on.gain );
		this.#changeProp( "detune", obj.detune, this.on.detune );
		this.#changeProp( "frequency", obj.frequency, this.on.frequency );
		this.on.drawCurve();
	}

	// .........................................................................
	#changeProp( prop, val, cb ) {
		if ( val !== undefined ) {
			this.data[ prop ] = val;
			cb( val );
		}
	}
};

Object.freeze( DAWCore.controllersFx.filter );
