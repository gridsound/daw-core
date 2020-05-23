"use strict";

DAWCore.controllersFx.filter = class {
	constructor( fns ) {
		this.on = GSUtils.mapCallbacks( [
			"type",
			"Q",
			"gain",
			"detune",
			"frequency",
			"drawCurve",
		], fns.dataCallbacks );
		this.data = Object.seal( DAWCore.json.effects.filter() );
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
		this._changeProp( "type", obj.type, this.on.type );
		this._changeProp( "Q", obj.Q, this.on.Q );
		this._changeProp( "gain", obj.gain, this.on.gain );
		this._changeProp( "detune", obj.detune, this.on.detune );
		this._changeProp( "frequency", obj.frequency, this.on.frequency );
		this.on.drawCurve();
	}

	_changeProp( prop, val, cb ) {
		if ( val !== undefined ) {
			this.data[ prop ] = val;
			cb( val );
		}
	}
};

Object.freeze( DAWCore.controllersFx.filter );
