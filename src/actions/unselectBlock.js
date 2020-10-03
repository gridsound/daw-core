"use strict";

DAWCore.actions.unselectBlock = id => {
	return [
		{ blocks: { [ id ]: { selected: false } } },
		[ "blocks", "unselectBlock" ],
	];
};
