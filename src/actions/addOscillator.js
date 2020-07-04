"use strict";

DAWCore.actions.addOscillator = ( synthId, get ) => {
	const oscs = get.synth( synthId ).oscillators,
		id = DAWCore.common.getNextIdOf( oscs ),
		osc = DAWCore.json.oscillator();

	osc.order = DAWCore.common.getNextOrderOf( oscs );
	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: osc } } } },
		[ "synth", "addOscillator", get.synth( synthId ).name ],
	];
};
