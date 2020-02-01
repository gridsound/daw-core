"use strict";

DAWCore.actions.renameSynth = function( id, newName ) {
	const syn = this.get.synth( id ),
		name = DAWCore.trim2( newName );

	if ( name && name !== syn.name ) {
		return [
			{ synths: { [ id ]: { name } } },
			[ "synths", "renameSynth", syn.name, name ],
		];
	}
};
