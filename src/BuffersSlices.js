"use strict";

DAWCore.BuffersSlices = class {
	#daw = null;
	#buffers = new Map();

	constructor( daw ) {
		this.#daw = daw;
		Object.seal( this );
	}

	// .........................................................................
	getBuffer( patId ) {
		return this.#buffers.get( patId );
	}
	clear() {
		this.#buffers.clear();
	}
	change( obj ) {
		if ( "patterns" in obj || "slices" in obj  ) {
			const get = this.#daw.get,
				ids = new Set();

			if ( "patterns" in obj ) {
				Object.entries( obj.patterns ).forEach( ( [ id, objPat ] ) => {
					if ( !objPat ) {
						this.#buffers.delete( id );
					} else if ( get.pattern( id ).type === "slices" ) {
						if ( "source" in objPat || "cropA" in objPat || "cropB" in objPat ) {
							ids.add( id );
						}
					}
				} );
			}
			if ( "slices" in obj ) {
				const pats = Object.entries( get.patterns() );

				Object.keys( obj.slices ).forEach( id => {
					if ( obj.slices[ id ] ) {
						ids.add( pats.find( kv => kv[ 1 ].slices === id )[ 0 ] );
					}
				} );
			}
			ids.forEach( id => {
				const src = get.pattern( id ).source,
					buf = src && get.audioBuffer( get.pattern( src ).buffer );

				if ( buf ) {
					this.#setBuffer( id, buf );
				}
			} );
		}
	}
	buffersLoaded( buffersLoaded ) {
		const get = this.#daw.get,
			bufToSli = Object.entries( get.patterns() ).reduce( ( map, [ id, pat ] ) => {
				if ( pat.type === "slices" ) {
					const bufId = get.pattern( pat.source ).buffer;

					if ( bufId in map ) {
						map[ bufId ][ id ] = true;
					} else {
						map[ bufId ] = { [ id ]: true };
					}
				}
				return map;
			}, {} );

		Object.entries( buffersLoaded ).forEach( ( [ id, obj ] ) => {
			if ( id in bufToSli ) {
				Object.keys( bufToSli[ id ] ).forEach( patId => this.#setBuffer( patId, obj.buffer ) );
			}
		} );
	}

	// .........................................................................
	#setBuffer( patSliId, buffer ) {
		const get = this.#daw.get,
			pat = get.pattern( patSliId ),
			bufSliced = gswaSlicer.createBuffer( get.ctx(), buffer, 0, 1, get.slices( pat.slices ) );

		this.#buffers.set( patSliId, bufSliced );
	}
};

Object.freeze( DAWCore.BuffersSlices );
