"use strict";

DAWCore.actions.set( "renameSynth", ( daw, id, newName ) => {
	const name = DAWCore.utils.trim2( newName );
	const syn = daw.$getSynth( id );

	if ( name && name !== syn.name ) {
		return [
			{ synths: { [ id ]: { name } } },
			[ "synths", "renameSynth", syn.name, name ],
		];
	}
} );
