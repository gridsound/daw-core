"use strict";

DAWCore.actions.set( "renameSynth", ( id, newName, get ) => {
	const syn = get.synth( id );
	const name = DAWCore.utils.trim2( newName );

	if ( name && name !== syn.name ) {
		return [
			{ synths: { [ id ]: { name } } },
			[ "synths", "renameSynth", syn.name, name ],
		];
	}
} );
