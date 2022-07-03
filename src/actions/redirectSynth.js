"use strict";

DAWCoreActions.set( "redirectSynth", ( daw, id, dest ) => {
	return [
		{ synths: { [ id ]: { dest } } },
		[ "synths", "redirectSynth", daw.$getSynth( id ).name, daw.$getChannel( dest ).name ],
	];
} );
