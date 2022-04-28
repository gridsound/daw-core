"use strict";

DAWCore.actions.set( "addSynth", get => {
	const id = DAWCore.actionsCommon.getNextIdOf( get.synths() );
	const name = DAWCore.actionsCommon.createUniqueName( "synths", "synth", get );
	const obj = {
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
} );
