"use strict";

DAWCoreActions.set( "addBlock", ( daw, pattern, when, track ) => {
	const nId = DAWCoreActionsCommon.getNextIdOf( daw.$getBlocks() );
	const objBlc = DAWCoreJSON.block( {
		pattern,
		when,
		track,
		duration: daw.$getPatternDuration( pattern ),
	} );
	const obj = { blocks: { [ nId ]: objBlc } };
	const dur = DAWCoreActionsCommon.calcNewDuration( daw, obj );

	if ( dur !== daw.$getDuration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		[ "blocks", "addBlock", daw.$getPattern( pattern ).name ],
	];
} );
