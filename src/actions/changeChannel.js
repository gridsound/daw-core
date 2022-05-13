"use strict";

DAWCore.actions.set( "changeChannel", ( daw, id, prop, val ) => {
	return [
		{ channels: { [ id ]: { [ prop ]: val } } },
		[ "channels", "changeChannel", daw.get.channel( id ).name, prop, val ],
	];
} );
