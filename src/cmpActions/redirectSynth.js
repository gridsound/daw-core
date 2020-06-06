"use strict";

DAWCore.actions.redirectSynth = ( id, dest, get ) => {
	return [
		{ synths: { [ id ]: { dest } } },
		[ "synths", "redirectSynth", get.synth( id ).name, get.channel( dest ).name ],
	];
};
