"use strict";

DAWCore.actions.renameChannel = ( id, newName, get ) => {
	const name = GSUtils.trim2( newName ),
		chan = get.channel( id );

	if ( name && name !== chan.name ) {
		return [
			{ channels: { [ id ]: { name } } },
			[ "channels", "renameChannel", chan.name, name ],
		];
	}
};
