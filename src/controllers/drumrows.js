"use strict";

DAWCore.controllers.drumrows = class {
	on = null;
	data = Object.freeze( {
		patterns: {},
		drumrows: {},
	} );
	#drumrowsCrud = DAWCore.utils.createUpdateDelete.bind( null, this.data.drumrows,
		this.#addDrumrow.bind( this ),
		this.#updateDrumrow.bind( this ),
		this.#deleteDrumrow.bind( this ) );
	#patternsCrud = DAWCore.utils.createUpdateDelete.bind( null, this.data.patterns,
		this.#addPattern.bind( this ),
		this.#updatePattern.bind( this ),
		this.#deletePattern.bind( this ) );

	constructor( fns ) {
		this.on = DAWCore.utils.mapCallbacks( [
			"addDrumrow",
			"removeDrumrow",
			"changeDrumrow",
		], fns.dataCallbacks );
		Object.freeze( this );
	}
	change( { patterns, drumrows } ) {
		if ( patterns ) { this.#patternsCrud( patterns ); }
		if ( drumrows ) { this.#drumrowsCrud( drumrows ); }
	}
	clear() {
		Object.keys( this.data.patterns ).forEach( id => delete this.data.patterns[ id ] );
		Object.keys( this.data.drumrows ).forEach( this.#deleteDrumrow, this );
	}

	// .........................................................................
	#addPattern( id, { type, name, dest, buffer, duration } ) {
		if ( type === "buffer" ) {
			const pat = Object.seal( { name, dest, buffer, duration } );

			this.data.patterns[ id ] = pat;
			this.#updatePattern( id, pat );
		}
	}
	#updatePattern( id, { name, duration, dest } ) {
		if ( name !== undefined || duration !== undefined || dest !== undefined ) {
			const pat = this.data.patterns[ id ];
			const rowsEnt = Object.entries( this.data.drumrows )
				.filter( kv => kv[ 1 ].pattern === id );

			this.#updatePattern2( pat, rowsEnt, "name", name );
			this.#updatePattern2( pat, rowsEnt, "dest", dest );
			this.#updatePattern2( pat, rowsEnt, "duration", duration );
		}
	}
	#updatePattern2( pat, rowsEnt, prop, val ) {
		if ( val !== undefined ) {
			pat[ prop ] = val;
			rowsEnt.forEach( kv => this.on.changeDrumrow( kv[ 0 ], prop, val ) );
		}
	}
	#deletePattern( id ) {
		delete this.data.patterns[ id ];
	}

	// .........................................................................
	#addDrumrow( id, obj ) {
		const row = Object.seal( { ...obj } );

		this.data.drumrows[ id ] = row;
		this.on.addDrumrow( id, row );
		this.#updateDrumrow2( id, row );
	}
	#deleteDrumrow( id ) {
		delete this.data.drumrows[ id ];
		this.on.removeDrumrow( id );
	}
	#updateDrumrow( id, obj ) {
		const row = this.data.drumrows[ id ];

		Object.assign( row, obj );
		this.#updateDrumrow2( id, obj );
	}
	#updateDrumrow2( id, obj ) {
		const pat = this.data.patterns[ obj.pattern ];

		this.#updateDrumrow3( id, "order", obj.order );
		this.#updateDrumrow3( id, "toggle", obj.toggle );
		this.#updateDrumrow3( id, "detune", obj.detune );
		this.#updateDrumrow3( id, "pan", obj.pan );
		this.#updateDrumrow3( id, "gain", obj.gain );
		this.#updateDrumrow3( id, "pattern", obj.pattern );
		this.#updateDrumrow3( id, "name", obj.pattern && pat.name );
		this.#updateDrumrow3( id, "duration", obj.pattern && pat.duration );
	}
	#updateDrumrow3( id, prop, val ) {
		if ( val !== undefined ) {
			this.on.changeDrumrow( id, prop, val );
		}
	}
};

Object.freeze( DAWCore.controllers.drumrows );
