"use strict";

DAWCoreActions.set( "addPatternBuffer", ( daw, fromLib, bufURL, audioBuf ) => {
	const buffs = daw.$getBuffers();
	const buffsArr = Object.values( buffs );
	const [ bufHash, bufName ] = bufURL.split( ":" );
	const notThere = !buffsArr.find( b => b.url === bufHash || b.hash === bufHash );

	if ( notThere ) {
		const pats = daw.$getPatterns();
		const chans = daw.$getChannels();
		const patId = DAWCoreActionsCommon.getNextIdOf( pats );
		const bufId = DAWCoreActionsCommon.getNextIdOf( buffs );
		const order = Object.values( pats ).reduce( ( max, pat ) => {
			return pat.type !== "buffer"
				? max
				: Math.max( max, pat.order );
		}, -1 ) + 1;
		const drumChan = fromLib === "default" && Object.entries( chans ).find( ( [ id, ch ] ) => ch.name === "drums" )?.[ 0 ];
		const dest = drumChan || "main";
		const buf = { duration: audioBuf.duration };
		const pat = {
			order,
			dest,
			type: "buffer",
			buffer: bufId,
			duration: Math.ceil( audioBuf.duration * daw.$getBPS() ),
			name: bufName,
		}

		if ( fromLib === "default" ) {
			pat.bufferType = "drum";
			buf.url = bufHash;
		} else {
			buf.hash = bufHash;
			daw.$buffersSetBuffer( { ...buf, buffer: audioBuf } );
		}
		return [
			{
				buffers: { [ bufId ]: buf },
				patterns: { [ patId ]: pat },
			},
			[ "patterns", "addPatternBuffer", bufName ],
		];
	}
} );
