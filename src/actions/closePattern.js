"use strict";

DAWCore.actions.closePattern = ( type, get ) => {
	const attr = DAWCore.actions.common.patternOpenedByType[ type ];

	if ( get[ attr ]() ) {
		return { [ attr ]: null };
	}
};
