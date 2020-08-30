"use strict";

DAWCore.controllers.synth = class {
	constructor( fns ) {
		this.data = Object.seal( {
			name: "",
			env: Object.seal( DAWCore.json.env() ),
			lfo: Object.seal( DAWCore.json.lfo() ),
			oscillators: {},
		} );
		this.on = GSUtils.mapCallbacks( [
			"addOsc",
			"removeOsc",
			"changeOsc",
			"changeOscProp",
			"updateOscWave",
			"changeLFO",
			"changeLFOProp",
			"updateLFOWave",
			"changeEnv",
			"changeEnvProp",
			"updateEnvWave",
		], fns.dataCallbacks );
		this._oscsCrud = GSUtils.createUpdateDelete.bind( null, this.data.oscillators,
			this._addOsc.bind( this ),
			this._updateOsc.bind( this ),
			this._deleteOsc.bind( this ) );
		Object.freeze( this );
	}

	// .........................................................................
	clear() {
		Object.keys( this.data.oscillators ).forEach( this._deleteOsc, this );
	}
	recall() {
		const oscs = Object.entries( this.data.oscillators );

		oscs.forEach( kv => this.on.removeOsc( kv[ 0 ] ) );
		oscs.forEach( kv => this.on.addOsc( kv[ 0 ], kv[ 1 ] ) );
	}
	change( obj ) {
		if ( "name" in obj ) {
			this.data.name = obj.name;
		}
		if ( obj.env ) {
			this._updateEnv( obj.env );
		}
		if ( obj.lfo ) {
			this._updateLFO( obj.lfo );
		}
		if ( obj.oscillators ) {
			this._oscsCrud( obj.oscillators );
		}
	}

	// .........................................................................
	_addOsc( id, obj ) {
		const osc = { ...obj };

		this.data.oscillators[ id ] = osc;
		this.on.addOsc( id, osc );
		this._updateOsc( id, osc );
	}
	_deleteOsc( id ) {
		delete this.data.oscillators[ id ];
		this.on.removeOsc( id );
	}
	_updateOsc( id, obj ) {
		const dataOsc = this.data.oscillators[ id ],
			cb = this.on.changeOscProp.bind( null, id );

		this._setProp( dataOsc, cb, "order", obj.order );
		this._setProp( dataOsc, cb, "type", obj.type );
		this._setProp( dataOsc, cb, "pan", obj.pan );
		this._setProp( dataOsc, cb, "gain", obj.gain );
		this._setProp( dataOsc, cb, "detune", obj.detune );
		this.on.updateOscWave( id );
		this.on.changeOsc( id, obj );
	}
	_updateEnv( obj ) {
		const dataEnv = this.data.env,
			cb = this.on.changeEnvProp;

		this._setProp( dataEnv, cb, "toggle", obj.toggle );
		this._setProp( dataEnv, cb, "attack", obj.attack );
		this._setProp( dataEnv, cb, "hold", obj.hold );
		this._setProp( dataEnv, cb, "decay", obj.decay );
		this._setProp( dataEnv, cb, "substain", obj.substain );
		this._setProp( dataEnv, cb, "release", obj.release );
		this.on.updateEnvWave();
		this.on.changeEnv( obj );
	}
	_updateLFO( obj ) {
		const dataLFO = this.data.lfo,
			cb = this.on.changeLFOProp;

		this._setProp( dataLFO, cb, "toggle", obj.toggle );
		this._setProp( dataLFO, cb, "type", obj.type );
		this._setProp( dataLFO, cb, "delay", obj.delay );
		this._setProp( dataLFO, cb, "attack", obj.attack );
		this._setProp( dataLFO, cb, "speed", obj.speed );
		this._setProp( dataLFO, cb, "amp", obj.amp );
		this.on.updateLFOWave();
		this.on.changeLFO( obj );
	}
	_setProp( data, cb, prop, val ) {
		if ( val !== undefined ) {
			data[ prop ] = val;
			cb( prop, val );
		}
	}
};

Object.freeze( DAWCore.controllers.synth );
