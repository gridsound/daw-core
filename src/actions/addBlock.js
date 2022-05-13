"use strict";

DAWCore.actions.set( "addBlock", ( pattern, when, track, _get, daw ) => {
	const nId = DAWCore.actionsCommon.getNextIdOf( daw.get.blocks() );
	const objBlc = DAWCore.json.block( {
		pattern,
		when,
		track,
		duration: daw.$getPatternDuration( pattern ),
	} );
	const obj = { blocks: { [ nId ]: objBlc } };
	const dur = DAWCore.actionsCommon.calcNewDuration( obj, daw );

	if ( dur !== daw.get.duration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		[ "blocks", "addBlock", daw.get.pattern( pattern ).name ],
	];
} );
