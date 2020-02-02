"use strict";

DAWCore.actions.renameComposition = function( nameBrut ) {
	const name = DAWCore.trim2( nameBrut ),
		oldName = this.get.name();

	if ( name && name !== oldName ) {
		return [
			{ name },
			[ "cmp", "renameComposition", oldName, name ],
		]
	}
};
