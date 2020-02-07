"use strict";

DAWCore.actions.addSynth = function( get ) {
	const id = DAWCore.common.getNextIdOf( get.synths() ),
		name = this._createUniqueName( "synths", "synth" ),
		obj = {
			synths: { [ id ]: DAWCore.json.synth( name ) },
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
