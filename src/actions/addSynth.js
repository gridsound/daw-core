"use strict";

DAWCore.actions.set( "addSynth", daw => {
	const id = DAWCore.actionsCommon.getNextIdOf( daw.$getSynths() );
	const name = DAWCore.actionsCommon.createUniqueName( daw.$getSynths(), "synth" );
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
