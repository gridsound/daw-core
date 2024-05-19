"use strict";

class DAWCoreControllerSynth {
	$on = null;
	$data = Object.seal( {
		name: "",
		env: Object.seal( DAWCoreJSON_env() ),
		lfo: Object.seal( DAWCoreJSON_lfo() ),
		oscillators: {},
	} );
	#oscsCrud = GSUcreateUpdateDelete.bind( null, this.$data.oscillators,
		this.#addOsc.bind( this ),
		this.#updateOsc.bind( this ),
		this.#deleteOsc.bind( this ) );

	constructor( fns ) {
		this.$on = { ...fns };
		Object.freeze( this );
	}

	// .........................................................................
	$clear() {
		Object.keys( this.$data.oscillators ).forEach( this.#deleteOsc, this );
	}
	$recall() {
		const oscs = Object.entries( this.$data.oscillators );

		oscs.forEach( kv => this.$on.$removeOsc( kv[ 0 ] ) );
		oscs.forEach( kv => this.$on.$addOsc( kv[ 0 ], kv[ 1 ] ) );
	}
	$change( obj ) {
		if ( "name" in obj ) {
			this.$data.name = obj.name;
		}
		if ( obj.env ) {
			GSUforEach( obj.env, DAWCoreControllerSynth.#setProp.bind( null, this.$data.env, this.$on.$changeEnvProp ) );
			this.$on.$updateEnvWave();
			this.$on.$changeEnv?.( obj.env );
		}
		if ( obj.lfo ) {
			GSUforEach( obj.lfo, DAWCoreControllerSynth.#setProp.bind( null, this.$data.lfo, this.$on.$changeLFOProp ) );
			this.$on.$updateLFOWave();
			this.$on.$changeLFO?.( obj.lfo );
		}
		if ( obj.oscillators ) {
			this.#oscsCrud( obj.oscillators );
		}
	}

	// .........................................................................
	#addOsc( id, obj ) {
		const osc = { ...obj };

		this.$data.oscillators[ id ] = osc;
		this.$on.$addOsc( id, osc );
	}
	#deleteOsc( id ) {
		delete this.$data.oscillators[ id ];
		this.$on.$removeOsc( id );
	}
	#updateOsc( id, obj ) {
		GSUforEach( obj, DAWCoreControllerSynth.#setProp.bind( null, this.$data.oscillators[ id ], this.$on.$changeOscProp.bind( null, id ) ) );
		this.$on.$changeOsc?.( id, obj );
	}
	static #setProp( data, cb, prop, val ) {
		if ( val !== undefined ) {
			data[ prop ] = val;
			cb( prop, val );
		}
	}
}

Object.freeze( DAWCoreControllerSynth );
