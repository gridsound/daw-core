"use strict";

DAWCore.actions.set( "addSynth", ( _get, daw ) => {
	const id = DAWCore.actionsCommon.getNextIdOf( daw.get.synths() );
	const name = DAWCore.actionsCommon.createUniqueName( "synths", "synth", daw.get );
	const obj = {
		synths: { [ id ]: DAWCore.json.synth( { name } ) },
		synthOpened: id,
	};

	if ( daw.$getOpened( "keys" ) != null ) {
		obj.patternKeysOpened = null;
	}
	return [
		obj,
		[ "synths", "addSynth", name ],
	];
} );
