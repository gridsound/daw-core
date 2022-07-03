"use strict";

DAWCoreActions.set( "addSynth", daw => {
	const id = DAWCoreActionsCommon.getNextIdOf( daw.$getSynths() );
	const name = DAWCoreActionsCommon.createUniqueName( daw.$getSynths(), "synth" );
	const obj = {
		synths: { [ id ]: DAWCoreJSON.synth( { name } ) },
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
