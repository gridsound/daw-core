"use strict";

DAWCore.actions.addSynth = function() {
	const id = DAWCore.common.getNextIdOf( this.get.synths() ),
		name = this._createUniqueName( "synths", "synth" ),
		obj = {
			synths: { [ id ]: DAWCore.json.synth( name ) },
			synthOpened: id,
		};

	if ( this.get.patternKeysOpened() != null ) {
		obj.patternKeysOpened = null;
	}
	return [
		obj,
		[ "synths", "addSynth", name ],
	];
};
