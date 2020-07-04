"use strict";

DAWCore.actions.changeLFO = ( synthId, prop, val, get ) => {
	return [
		{ synths: { [ synthId ]: { lfo: { [ prop ]: val } } } },
		[ "synth", "changeLFO", get.synth( synthId ).name, prop, val ],
	];
};
