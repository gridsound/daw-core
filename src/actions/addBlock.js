"use strict";

DAWCore.actions.set( "addBlock", ( daw, pattern, when, track ) => {
	const nId = DAWCore.actionsCommon.getNextIdOf( daw.$getBlocks() );
	const objBlc = DAWCore.json.block( {
		pattern,
		when,
		track,
		duration: daw.$getPatternDuration( pattern ),
	} );
	const obj = { blocks: { [ nId ]: objBlc } };
	const dur = DAWCore.actionsCommon.calcNewDuration( daw, obj );

	if ( dur !== daw.$getDuration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		[ "blocks", "addBlock", daw.$getPattern( pattern ).name ],
	];
} );
