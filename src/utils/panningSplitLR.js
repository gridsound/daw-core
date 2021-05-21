"use strict";

DAWCore.utils.panningSplitLR = pan => {
	return (
		pan < 0 ? [ 1, 1 + pan ] :
		pan > 0 ? [ 1 - pan, 1 ] : [ 1, 1 ]
	);
};
