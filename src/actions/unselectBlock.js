"use strict";

function DAWCoreActions_unselectBlock( _daw, id ) {
	return [
		{ blocks: { [ id ]: { selected: false } } },
		[ "blocks", "unselectBlock" ],
	];
}
