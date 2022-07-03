"use strict";

DAWCoreActions.set( "unselectBlock", ( _daw, id ) => {
	return [
		{ blocks: { [ id ]: { selected: false } } },
		[ "blocks", "unselectBlock" ],
	];
} );
