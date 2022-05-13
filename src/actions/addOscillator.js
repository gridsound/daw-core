"use strict";

DAWCore.actions.set( "addOscillator", ( daw, synthId ) => {
	const oscs = daw.get.synth( synthId ).oscillators;
	const id = DAWCore.actionsCommon.getNextIdOf( oscs );
	const osc = DAWCore.json.oscillator();

	osc.order = DAWCore.actionsCommon.getNextOrderOf( oscs );
	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: osc } } } },
		[ "synth", "addOscillator", daw.get.synth( synthId ).name ],
	];
} );
