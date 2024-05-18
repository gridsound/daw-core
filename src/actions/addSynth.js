"use strict";

DAWCoreActions.set( "addSynth", daw => {
	const id = DAWCoreActionsCommon_getNextIdOf( daw.$getSynths() );
	const name = DAWCoreActionsCommon_createUniqueName( daw.$getSynths(), "synth" );
	const obj = {
		synthOpened: id,
		synths: { [ id ]: DAWCoreJSON.synth( {
			name,
			oscillators: {
				0: DAWCoreJSON.oscillator( { gain: .75 } ),
				1: DAWCoreJSON.oscillator( { order: 1, gain: .2, detune: -24 } ),
			},
		} ) },
	};

	if ( daw.$getOpened( "keys" ) != null ) {
		obj.patternKeysOpened = null;
	}
	return [
		obj,
		[ "synths", "addSynth", name ],
	];
} );
