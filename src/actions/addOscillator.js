"use strict";

DAWCoreActions.set( "addOscillator", ( daw, synthId ) => {
	const oscs = daw.$getSynth( synthId ).oscillators;
	const id = DAWCoreActionsCommon.getNextIdOf( oscs );
	const osc = DAWCoreJSON.oscillator();

	osc.order = DAWCoreActionsCommon.getNextOrderOf( oscs );
	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: osc } } } },
		[ "synth", "addOscillator", daw.$getSynth( synthId ).name ],
	];
} );
