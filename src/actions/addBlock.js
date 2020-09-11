"use strict";

DAWCore.actions.addBlock = ( pattern, when, track, get ) => {
	const pat = get.pattern( pattern ),
		nId = DAWCore.common.getNextIdOf( get.blocks() ),
		objBlc = DAWCore.json.block( {
			pattern,
			when,
			track,
			duration: pat.duration,
		} ),
		obj = { blocks: { [ nId ]: objBlc } },
		dur = DAWCore.common.calcNewDuration( obj, get );

	if ( dur !== get.duration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		[ "blocks", "addBlock", pat.name ],
	];
};
