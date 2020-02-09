"use strict";

DAWCore.actions.removeOscillator = ( synthId, id, get ) => {
	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: undefined } } } },
		[ "synth", "removeOscillator", get.synth( synthId ).name ],
	];
};
