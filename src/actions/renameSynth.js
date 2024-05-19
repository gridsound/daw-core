"use strict";

DAWCoreActions.renameSynth = ( daw, id, newName ) => {
	const name = GSUtrim2( newName );
	const syn = daw.$getSynth( id );

	if ( name && name !== syn.name ) {
		return [
			{ synths: { [ id ]: { name } } },
			[ "synths", "renameSynth", syn.name, name ],
		];
	}
};
