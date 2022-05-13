"use strict";

DAWCore.actions.set( "closePattern", ( daw, type ) => {
	if ( daw.$getOpened( type ) ) {
		return { [ DAWCore.actionsCommon.patternOpenedByType[ type ] ]: null };
	}
} );
