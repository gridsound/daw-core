"use strict";

function DAWCoreActions_addSynth( daw ) {
	const id = DAWCoreActionsCommon_getNextIdOf( daw.$getSynths() );
	const name = DAWCoreActionsCommon_createUniqueName( daw.$getSynths(), "synth" );
	const obj = {
		synthOpened: id,
		synths: { [ id ]: DAWCoreJSON_synth( {
			name,
			oscillators: {
				0: DAWCoreJSON_oscillator( { gain: .75 } ),
				1: DAWCoreJSON_oscillator( { order: 1, gain: .2, detune: -24 } ),
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
}
