"use strict";

DAWCore.actions.redirectPatternBuffer = ( id, dest, get ) => {
	return [
		{ patterns: { [ id ]: { dest } } },
		[ "patterns", "redirectPatternBuffer", get.pattern( id ).name, get.channel( dest ).name ],
	];
};
