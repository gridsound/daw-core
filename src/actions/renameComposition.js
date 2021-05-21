"use strict";

DAWCore.actions.renameComposition = ( nameBrut, get ) => {
	const name = DAWCore.utils.trim2( nameBrut ),
		oldName = get.name();

	if ( name && name !== oldName ) {
		return [
			{ name },
			[ "cmp", "renameComposition", oldName, name ],
		];
	}
};
