"use strict";

DAWCore.actions.renameChannel = ( id, newName, get ) => {
	const name = DAWCore.utils.trim2( newName ),
		chan = get.channel( id );

	if ( name && name !== chan.name ) {
		return [
			{ channels: { [ id ]: { name } } },
			[ "channels", "renameChannel", chan.name, name ],
		];
	}
};
