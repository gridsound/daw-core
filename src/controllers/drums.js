"use strict";

class DAWCoreControllerDrums {
	$on = {};
	$data = {};
	#duration = 0;
	#beatsPerMeasure = 4;
	#drumsCrud = GSUcreateUpdateDelete.bind( null, this.$data,
		this.#addDrum.bind( this ),
		this.#changeDrum.bind( this ),
		this.#deleteDrum.bind( this ) );

	constructor( fns ) {
		this.$on = { ...fns };
		Object.freeze( this );
	}
	$setTimedivision( timediv ) {
		this.#beatsPerMeasure = GSUsplitNums( timediv, "/" )[ 1 ];
	}
	$change( obj ) {
		this.#drumsCrud( obj );
	}
	$clear() {
		Object.keys( this.$data ).forEach( this.#deleteDrum, this );
	}

	// .........................................................................
	#addDrum( id, obj ) {
		const cpy = { ...obj };

		this.$data[ id ] = cpy;
		this.#updateDuration();
		if ( "gain" in cpy ) {
			this.$on.$addDrum( id, cpy );
			this.#changeDrum( id, cpy );
		} else {
			this.$on.$addDrumcut( id, cpy );
		}
	}
	#deleteDrum( id ) {
		const fn = "gain" in this.$data[ id ]
			? this.$on.$removeDrum
			: this.$on.$removeDrumcut;

		delete this.$data[ id ];
		this.#updateDuration();
		fn( id );
	}
	#changeDrum( id, obj ) {
		this.#changeDrumProp( id, "detune", obj.detune );
		this.#changeDrumProp( id, "gain", obj.gain );
		this.#changeDrumProp( id, "pan", obj.pan );
	}
	#changeDrumProp( id, prop, val ) {
		if ( val !== undefined ) {
			this.$data[ id ][ prop ] = val;
			this.$on.$changeDrum( id, prop, val );
		}
	}
	#updateDuration() {
		const dur = Object.values( this.$data ).reduce( ( dur, blc ) => Math.max( dur, blc.when ), 0 );
		const dur2 = ( Math.floor( dur / this.#beatsPerMeasure ) + 1 ) * this.#beatsPerMeasure;

		if ( dur2 !== this.#duration ) {
			this.#duration = dur2;
			this.$on.$changeDuration( dur2 );
		}
	}
}

Object.freeze( DAWCoreControllerDrums );
