"use strict";

DAWCore.actions.set( "redirectSynth", ( id, dest, get ) => {
	return [
		{ synths: { [ id ]: { dest } } },
		[ "synths", "redirectSynth", get.synth( id ).name, get.channel( dest ).name ],
	];
} );
