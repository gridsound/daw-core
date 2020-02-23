"use strict";

DAWCore.actions.addSynth = get => {
	const id = DAWCore.common.getNextIdOf( get.synths() ),
		name = DAWCore.common.createUniqueName( "synths", "synth", get ),
		obj = {
			synths: { [ id ]: DAWCore.json.synth( { name } ) },
			synthOpened: id,
		};

	if ( get.patternKeysOpened() != null ) {
		obj.patternKeysOpened = null;
	}
	return [
		obj,
		[ "synths", "addSynth", name ],
	];
};
