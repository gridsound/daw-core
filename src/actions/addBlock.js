"use strict";

DAWCore.actions.addBlock = ( pattern, when, track, get ) => {
	const nId = DAWCore.actions.common.getNextIdOf( get.blocks() ),
		objBlc = DAWCore.json.block( {
			pattern,
			when,
			track,
			duration: get.patternDuration( pattern ),
		} ),
		obj = { blocks: { [ nId ]: objBlc } },
		dur = DAWCore.actions.common.calcNewDuration( obj, get );

	if ( dur !== get.duration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		[ "blocks", "addBlock", get.pattern( pattern ).name ],
	];
};
