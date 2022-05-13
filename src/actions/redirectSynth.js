"use strict";

DAWCore.actions.set( "redirectSynth", ( daw, id, dest ) => {
	return [
		{ synths: { [ id ]: { dest } } },
		[ "synths", "redirectSynth", daw.get.synth( id ).name, daw.get.channel( dest ).name ],
	];
} );
