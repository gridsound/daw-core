"use strict";

class DAWCoreControllerBlocks {
	$on = null;
	$data = {};
	#duration = 0;
	#beatsPerMeasure = 4;
	#blocksCrud = GSUcreateUpdateDelete.bind( null, this.$data,
		this.#addBlock.bind( this ),
		this.#updateBlock.bind( this ),
		this.#deleteBlock.bind( this ) );

	constructor( fns ) {
		this.$on = { ...fns };
		Object.freeze( this );
	}

	// .........................................................................
	$setTimedivision( timediv ) {
		this.#beatsPerMeasure = GSUsplitNums( timediv, "/" )[ 1 ];
	}
	$clear() {
		Object.keys( this.$data ).forEach( this.#deleteBlock, this );
	}
	$change( obj ) {
		this.#blocksCrud( obj.blocks );
	}

	// .........................................................................
	#addBlock( id, obj ) {
		const blc = { ...obj };

		this.$data[ id ] = blc;
		this.#updateDuration();
		this.$on.$addBlock( id, blc );
		this.#updateBlock( id, blc );
	}
	#deleteBlock( id ) {
		delete this.$data[ id ];
		this.#updateDuration();
		this.$on.$removeBlock( id );
	}
	#updateBlock( id, obj ) {
		const dataBlc = this.$data[ id ];
		const cb = this.$on.$changeBlockProp.bind( null, id );

		this.#setProp( dataBlc, cb, "when", obj.when );
		this.#setProp( dataBlc, cb, "duration", obj.duration );
		this.#setProp( dataBlc, cb, "offset", obj.offset );
		this.#setProp( dataBlc, cb, "track", obj.track );
		this.#setProp( dataBlc, cb, "selected", obj.selected );
		if ( "offset" in obj || "duration" in obj ) {
			this.$on.$updateBlockViewBox( id, dataBlc );
		}
		this.#updateDuration();
	}
	#setProp( data, cb, prop, val ) {
		if ( val !== undefined ) {
			data[ prop ] = val;
			cb( prop, val );
		}
	}
	#updateDuration() {
		const dur = Object.values( this.$data ).reduce( ( dur, blc ) => Math.max( dur, blc.when + blc.duration ), 0 );
		const dur2 = Math.max( 1, Math.ceil( dur / this.#beatsPerMeasure ) ) * this.#beatsPerMeasure;

		if ( dur2 !== this.#duration ) {
			this.#duration = dur2;
			this.$on.$changeDuration( dur2 );
		}
	}
}

Object.freeze( DAWCoreControllerBlocks );
