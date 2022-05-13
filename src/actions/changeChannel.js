"use strict";

DAWCore.actions.set( "changeChannel", ( daw, id, prop, val ) => {
	return [
		{ channels: { [ id ]: { [ prop ]: val } } },
		[ "channels", "changeChannel", daw.$getChannel( id ).name, prop, val ],
	];
} );
