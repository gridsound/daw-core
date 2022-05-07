"use strict";

class DAWCoreSlicesBuffers {
	static change( slicesBuffers, get, obj ) {
		if ( "patterns" in obj || "slices" in obj  ) {
			const ids = new Set();

			if ( "patterns" in obj ) {
				Object.entries( obj.patterns ).forEach( ( [ id, objPat ] ) => {
					if ( !objPat ) {
						slicesBuffers.delete( id );
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
				const src = get.pattern( id ).source;
				const buf = src && get.audioBuffer( get.pattern( src ).buffer );

				if ( buf ) {
					DAWCore.BuffersSlices.#setBuffer( slicesBuffers, get, id, buf );
				}
			} );
		}
	}
	static buffersLoaded( slicesBuffers, get, buffersLoaded ) {
		const bufToSli = Object.entries( get.patterns() ).reduce( ( map, [ id, pat ] ) => {
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
				Object.keys( bufToSli[ id ] ).forEach( patId =>
					DAWCore.BuffersSlices.#setBuffer( slicesBuffers, get, patId, obj.buffer ) );
			}
		} );
	}

	// .........................................................................
	static #setBuffer( slicesBuffers, get, patSliId, buffer ) {
		const pat = get.pattern( patSliId );
		const bufSliced = gswaSlicer.createBuffer( get.ctx(), buffer, 0, 1, get.slices( pat.slices ) );

		slicesBuffers.set( patSliId, bufSliced );
	}
}
