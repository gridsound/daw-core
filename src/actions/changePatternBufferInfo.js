"use strict";

DAWCore.actions.changePatternBufferInfo = ( id, { name, type, bpm }, get ) => {
	const pat = get.pattern( id ),
		obj = {};

	if ( type !== pat.bufferType ) {
		obj.bufferType = type;
		if ( pat.bufferType === "loop" ) {
			obj.bufferBpm = undefined;
		}
	}
	if ( bpm !== pat.bufferBpm && type === "loop" ) {
		obj.bufferBpm = bpm;
	}
	if ( name !== pat.name ) {
		obj.name = name;
	}
	if ( DAWCore.utils.isntEmpty( obj ) ) {
		return [
			{ patterns: { [ id ]: obj } },
			[ "patterns", "changePatternBufferInfo", name || pat.name ],
		];
	}
};
