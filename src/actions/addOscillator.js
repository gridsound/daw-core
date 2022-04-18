"use strict";

DAWCore.actions.addOscillator = ( synthId, get ) => {
	const oscs = get.synth( synthId ).oscillators;
	const id = DAWCore.actions.common.getNextIdOf( oscs );
	const osc = DAWCore.json.oscillator();

	osc.order = DAWCore.actions.common.getNextOrderOf( oscs );
	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: osc } } } },
		[ "synth", "addOscillator", get.synth( synthId ).name ],
	];
};
