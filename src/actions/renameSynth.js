"use strict";

DAWCoreActions.set( "renameSynth", ( daw, id, newName ) => {
	const name = DAWCoreUtils.$trim2( newName );
	const syn = daw.$getSynth( id );

	if ( name && name !== syn.name ) {
		return [
			{ synths: { [ id ]: { name } } },
			[ "synths", "renameSynth", syn.name, name ],
		];
	}
} );
