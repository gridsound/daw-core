"use strict";

function DAWCoreActions_changeChannel( daw, id, prop, val ) {
	return [
		{ channels: { [ id ]: { [ prop ]: val } } },
		[ "channels", "changeChannel", daw.$getChannel( id ).name, prop, val ],
	];
}
