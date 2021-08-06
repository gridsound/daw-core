"use strict";

DAWCore.actions.redirectChannel = ( id, dest, get ) => {
	if ( id !== "main" && id !== dest ) {
		return [
			{ channels: { [ id ]: { dest } } },
			[ "channels", "redirectChannel", get.channel( id ).name, get.channel( dest ).name ],
		];
	}
};
