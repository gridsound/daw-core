"use strict";

DAWCoreControllers.synth = class {
	on = null;
	data = Object.seal( {
		name: "",
		env: Object.seal( DAWCoreJSON.env() ),
		lfo: Object.seal( DAWCoreJSON.lfo() ),
		oscillators: {},
	} );
	#oscsCrud = DAWCoreUtils.$createUpdateDelete.bind( null, this.data.oscillators,
		this.#addOsc.bind( this ),
		this.#updateOsc.bind( this ),
		this.#deleteOsc.bind( this ) );

	constructor( fns ) {
		this.on = DAWCoreUtils.$mapCallbacks( [
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
		Object.freeze( this );
	}

	// .........................................................................
	clear() {
		Object.keys( this.data.oscillators ).forEach( this.#deleteOsc, this );
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
			this.#updateEnv( obj.env );
		}
		if ( obj.lfo ) {
			this.#updateLFO( obj.lfo );
		}
		if ( obj.oscillators ) {
			this.#oscsCrud( obj.oscillators );
		}
	}

	// .........................................................................
	#addOsc( id, obj ) {
		const osc = { ...obj };

		this.data.oscillators[ id ] = osc;
		this.on.addOsc( id, osc );
		this.#updateOsc( id, osc );
	}
	#deleteOsc( id ) {
		delete this.data.oscillators[ id ];
		this.on.removeOsc( id );
	}
	#updateOsc( id, obj ) {
		const dataOsc = this.data.oscillators[ id ];
		const cb = this.on.changeOscProp.bind( null, id );

		this.#setProp( dataOsc, cb, "order", obj.order );
		this.#setProp( dataOsc, cb, "type", obj.type );
		this.#setProp( dataOsc, cb, "pan", obj.pan );
		this.#setProp( dataOsc, cb, "gain", obj.gain );
		this.#setProp( dataOsc, cb, "detune", obj.detune );
		this.#setProp( dataOsc, cb, "detunefine", obj.detunefine );
		this.#setProp( dataOsc, cb, "unisonvoices", obj.unisonvoices );
		this.#setProp( dataOsc, cb, "unisondetune", obj.unisondetune );
		this.#setProp( dataOsc, cb, "unisonblend", obj.unisonblend );
		this.on.updateOscWave( id );
		this.on.changeOsc( id, obj );
	}
	#updateEnv( obj ) {
		const dataEnv = this.data.env;
		const cb = this.on.changeEnvProp;

		this.#setProp( dataEnv, cb, "toggle", obj.toggle );
		this.#setProp( dataEnv, cb, "attack", obj.attack );
		this.#setProp( dataEnv, cb, "hold", obj.hold );
		this.#setProp( dataEnv, cb, "decay", obj.decay );
		this.#setProp( dataEnv, cb, "sustain", obj.sustain );
		this.#setProp( dataEnv, cb, "release", obj.release );
		this.on.updateEnvWave();
		this.on.changeEnv( obj );
	}
	#updateLFO( obj ) {
		const dataLFO = this.data.lfo;
		const cb = this.on.changeLFOProp;

		this.#setProp( dataLFO, cb, "toggle", obj.toggle );
		this.#setProp( dataLFO, cb, "type", obj.type );
		this.#setProp( dataLFO, cb, "delay", obj.delay );
		this.#setProp( dataLFO, cb, "attack", obj.attack );
		this.#setProp( dataLFO, cb, "speed", obj.speed );
		this.#setProp( dataLFO, cb, "amp", obj.amp );
		this.on.updateLFOWave();
		this.on.changeLFO( obj );
	}
	#setProp( data, cb, prop, val ) {
		if ( val !== undefined ) {
			data[ prop ] = val;
			cb( prop, val );
		}
	}
};

Object.freeze( DAWCoreControllers.synth );
