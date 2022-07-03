"use strict";

DAWCore.actions.set( "closePattern", ( daw, type ) => {
	if ( daw.$getOpened( type ) ) {
		return { [ DAWCoreActionsCommon.patternOpenedByType[ type ] ]: null };
	}
} );
