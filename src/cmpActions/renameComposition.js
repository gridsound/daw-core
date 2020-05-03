"use strict";

DAWCore.actions.renameComposition = ( nameBrut, get ) => {
	const name = GSUtils.trim2( nameBrut ),
		oldName = get.name();

	if ( name && name !== oldName ) {
		return [
			{ name },
			[ "cmp", "renameComposition", oldName, name ],
		];
	}
};
