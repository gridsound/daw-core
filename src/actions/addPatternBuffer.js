"use strict";

DAWCoreActions.set( "addPatternBuffer", ( daw, bufURL, bufDur ) => {
	const buffs = daw.$getBuffers();

	if ( !Object.values( buffs ).find( b => b.url === bufURL ) ) {
		const pats = daw.$getPatterns();
		const chans = daw.$getChannels();
		const patId = DAWCoreActionsCommon.getNextIdOf( pats );
		const bufId = DAWCoreActionsCommon.getNextIdOf( buffs );
		const order = Object.values( pats ).reduce( ( max, pat ) => {
			return pat.type !== "buffer"
				? max
				: Math.max( max, pat.order );
		}, -1 ) + 1;
		const dest = Object.entries( chans ).find( ( [ id, ch ] ) => ch.name === "drums" )?.[ 0 ] || "main";
		const obj = {
			buffers: {
				[ bufId ]: { MIME: "audio/wav", duration: bufDur, url: bufURL },
			},
			patterns: {
				[ patId ]: {
					order,
					dest,
					type: "buffer",
					buffer: bufId,
					duration: Math.ceil( bufDur * daw.$getBPS() ),
					name: bufURL,
					bufferType: "drum",
				},
			}
		};

		return [
			obj,
			[ "patterns", "addPatternBuffer", bufURL ],
		];
	}
} );
