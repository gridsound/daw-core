"use strict";

DAWCore.actions.set( "addBlock", ( pattern, when, track, get ) => {
	const nId = DAWCore.actionsCommon.getNextIdOf( get.blocks() );
	const objBlc = DAWCore.json.block( {
		pattern,
		when,
		track,
		duration: get.patternDuration( pattern ),
	} );
	const obj = { blocks: { [ nId ]: objBlc } };
	const dur = DAWCore.actionsCommon.calcNewDuration( obj, get );

	if ( dur !== get.duration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		[ "blocks", "addBlock", get.pattern( pattern ).name ],
	];
} );
