"use strict";

class DAWCoreSlicesBuffers {
	static change( daw, slicesBuffers, obj ) {
		if ( "patterns" in obj || "slices" in obj  ) {
			const ids = new Set();

			if ( "patterns" in obj ) {
				Object.entries( obj.patterns ).forEach( ( [ id, objPat ] ) => {
					if ( !objPat ) {
						slicesBuffers.delete( id );
					} else if ( daw.get.pattern( id ).type === "slices" ) {
						if ( "source" in objPat || "cropA" in objPat || "cropB" in objPat ) {
							ids.add( id );
						}
					}
				} );
			}
			if ( "slices" in obj ) {
				const pats = Object.entries( daw.get.patterns() );

				Object.keys( obj.slices ).forEach( id => {
					if ( obj.slices[ id ] ) {
						ids.add( pats.find( kv => kv[ 1 ].slices === id )[ 0 ] );
					}
				} );
			}
			ids.forEach( id => {
				const src = daw.get.pattern( id ).source;
				const buf = src && daw.$getAudioBuffer( daw.get.pattern( src ).buffer );

				if ( buf ) {
					DAWCoreSlicesBuffers.#setBuffer( slicesBuffers, daw, id, buf );
				}
			} );
		}
	}
	static buffersLoaded( daw, slicesBuffers, buffersLoaded ) {
		const bufToSli = Object.entries( daw.get.patterns() ).reduce( ( map, [ id, pat ] ) => {
			if ( pat.type === "slices" ) {
				const bufId = daw.get.pattern( pat.source ).buffer;

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
					DAWCoreSlicesBuffers.#setBuffer( slicesBuffers, daw, patId, obj.buffer ) );
			}
		} );
	}

	// .........................................................................
	static #setBuffer( slicesBuffers, daw, patSliId, buffer ) {
		const pat = daw.get.pattern( patSliId );
		const bufSliced = gswaSlicer.createBuffer( daw.$getCtx(), buffer, 0, 1, daw.get.slices( pat.slices ) );

		slicesBuffers.set( patSliId, bufSliced );
	}
}
