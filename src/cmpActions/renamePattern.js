"use strict";

DAWCore.actions.renamePattern = function( id, newName ) {
	const name = DAWCore.trim2( newName ),
		pat = this.get.pattern( id );

	if ( name && name !== pat.name ) {
		return [
			{ patterns: { [ id ]: { name } } },
			[ "patterns", "renamePattern", pat.type, pat.name, name ],
		];
	}
};
