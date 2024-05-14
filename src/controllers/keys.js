"use strict";

class DAWCoreControllerKeys {
	$on = null;
	$data = {};
	#duration = 0;
	#beatsPerMeasure = 4;
	#keysCrud = GSUcreateUpdateDelete.bind( null, this.$data,
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
		this.$on = { ...fns };
		Object.freeze( this );
	}

	// .........................................................................
	$setTimedivision( timediv ) {
		this.#beatsPerMeasure = GSUsplitNums( timediv, "/" )[ 1 ];
	}
	$change( keysObj ) {
		this.#keysCrud( keysObj );
	}
	$clear() {
		Object.keys( this.$data ).forEach( this.#deleteKey, this );
	}

	// .........................................................................
	#addKey( id, obj ) {
		const key = { ...obj };

		this.$data[ id ] = key;
		this.#updateDuration();
		this.$on.$addKey( id, key );
		this.#updateKey( id, key );
	}
	#deleteKey( id ) {
		delete this.$data[ id ];
		this.#updateDuration();
		this.$on.$removeKey( id );
	}
	#updateKey( id, obj ) {
		DAWCoreControllerKeys.#keyProps.forEach(
			DAWCoreControllerKeys.#setProp.bind( null,
				this.$data[ id ],
				this.$on.$changeKeyProp.bind( null, id ),
				obj
			)
		);
		this.#updateDuration();
	}
	static #setProp( data, cb, obj, prop ) {
		const val = obj[ prop ];

		if ( val !== undefined ) {
			data[ prop ] = val;
			cb( prop, val );
		}
	}
	#updateDuration() {
		const dur = Object.values( this.$data ).reduce( ( dur, blc ) => Math.max( dur, blc.when + blc.duration ), 0 );
		const dur2 = ( Math.floor( dur / this.#beatsPerMeasure ) + 1 ) * this.#beatsPerMeasure;

		if ( dur2 !== this.#duration ) {
			this.#duration = dur2;
			this.$on.$changeDuration( dur2 );
		}
	}
}

Object.freeze( DAWCoreControllerKeys );
