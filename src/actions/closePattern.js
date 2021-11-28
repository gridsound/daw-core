"use strict";

DAWCore.actions.closePattern = ( type, get ) => {
	if ( get.opened( type ) ) {
		return { [ DAWCore.actions.common.patternOpenedByType[ type ] ]: null };
	}
};
