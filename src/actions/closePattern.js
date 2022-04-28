"use strict";

DAWCore.actions.set( "closePattern", ( type, get ) => {
	if ( get.opened( type ) ) {
		return { [ DAWCore.actionsCommon.patternOpenedByType[ type ] ]: null };
	}
} );
