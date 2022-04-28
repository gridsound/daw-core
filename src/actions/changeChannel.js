"use strict";

DAWCore.actions.set( "changeChannel", ( id, prop, val, get ) => {
	return [
		{ channels: { [ id ]: { [ prop ]: val } } },
		[ "channels", "changeChannel", get.channel( id ).name, prop, val ],
	];
} );
