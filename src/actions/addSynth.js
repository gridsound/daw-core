"use strict";

DAWCore.actions.addSynth = get => {
	const id = DAWCore.actions.common.getNextIdOf( get.synths() ),
		name = DAWCore.actions.common.createUniqueName( "synths", "synth", get ),
		obj = {
			synths: { [ id ]: DAWCore.json.synth( { name } ) },
			synthOpened: id,
		};

	if ( get.opened( "keys" ) != null ) {
		obj.patternKeysOpened = null;
	}
	return [
		obj,
		[ "synths", "addSynth", name ],
	];
};
