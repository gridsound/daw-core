"use strict";

DAWCore.actions.closePattern = ( type, get ) => {
	if ( get.opened( type ) ) {
		return { [ DAWCore.actionsCommon.patternOpenedByType[ type ] ]: null };
	}
};
