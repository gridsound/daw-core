"use strict";

DAWCore.actions.set( "closePattern", ( type, _get, daw ) => {
	if ( daw.$getOpened( type ) ) {
		return { [ DAWCore.actionsCommon.patternOpenedByType[ type ] ]: null };
	}
} );
