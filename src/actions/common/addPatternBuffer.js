"use strict";

/**
 * srcType can be:
 * - "pattern-buffer"
 * - "pattern-slices"
 * - "pattern-drums"
 * - "pattern-keys"
 * - "library-buffer:default"
 * - "library-buffer:local"
*/
DAWCoreActionsCommon.addPatternBuffer = ( daw, srcType, srcPatId ) => {
	if ( !srcType.includes( ':' ) ) {
		return Promise.resolve( [ srcPatId, daw.$getPattern( srcPatId ).name, null ] );
	}

	const pats = daw.$getPatterns();
	const buffs = daw.$getBuffers();
	const buffsArr = Object.entries( buffs );
	const [ bufHash, bufName ] = srcPatId.split( ":" );
	const bufFoundId = buffsArr.find( kv => kv[ 1 ].url === bufHash || kv[ 1 ].hash === bufHash )?.[ 0 ];

	if ( bufFoundId ) {
		const patsArr = Object.entries( pats );
		const pat = patsArr.find( kv => kv[ 1 ].buffer === bufFoundId );

		return Promise.resolve( [ pat[ 0 ], pat[ 1 ].name, null ] );
	}
	return daw.$buffersGetAudioBuffer( bufHash ).then( audioBuf => {
		const lib = srcType.split( ":" )[ 1 ];
		const patId = DAWCoreActionsCommon.getNextIdOf( pats );
		const bufId = DAWCoreActionsCommon.getNextIdOf( buffs );
		const order = Object.values( pats ).reduce( ( max, pat ) => {
			return pat.type !== "buffer"
				? max
				: Math.max( max, pat.order );
		}, -1 ) + 1;
		const buf = { duration: audioBuf.duration };
		const pat = {
			order,
			dest: "main",
			type: "buffer",
			buffer: bufId,
			duration: Math.ceil( audioBuf.duration * daw.$getBPS() ),
			name: bufName,
		};

		if ( lib === "default" ) {
			const drumChan = Object.entries( daw.$getChannels() ).find( ( [ id, ch ] ) => ch.name === "drums" )?.[ 0 ];

			pat.bufferType = "drum";
			pat.dest = drumChan || "main";
			buf.url = bufHash;
		} else {
			buf.hash = bufHash;
			daw.$buffersSetBuffer( { ...buf, buffer: audioBuf } );
		}
		return [ patId, bufName, {
			buffers: { [ bufId ]: buf },
			patterns: { [ patId ]: pat },
		} ];
	} );
};
