"use strict";

DAWCore.actions.renameSynth = ( id, newName, get ) => {
	const syn = get.synth( id ),
		name = GSUtils.trim2( newName );

	if ( name && name !== syn.name ) {
		return [
			{ synths: { [ id ]: { name } } },
			[ "synths", "renameSynth", syn.name, name ],
		];
	}
};
