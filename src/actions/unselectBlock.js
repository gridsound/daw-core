"use strict";

DAWCoreActions.unselectBlock = ( _daw, id ) => {
	return [
		{ blocks: { [ id ]: { selected: false } } },
		[ "blocks", "unselectBlock" ],
	];
};
