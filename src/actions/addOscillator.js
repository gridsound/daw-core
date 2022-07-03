"use strict";

DAWCore.actions.set( "addOscillator", ( daw, synthId ) => {
	const oscs = daw.$getSynth( synthId ).oscillators;
	const id = DAWCore.actionsCommon.getNextIdOf( oscs );
	const osc = DAWCoreJSON.oscillator();

	osc.order = DAWCore.actionsCommon.getNextOrderOf( oscs );
	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: osc } } } },
		[ "synth", "addOscillator", daw.$getSynth( synthId ).name ],
	];
} );
