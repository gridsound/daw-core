"use strict";

DAWCoreActions.closePattern = ( daw, type ) => {
	if ( daw.$getOpened( type ) ) {
		return { [ DAWCoreActionsCommon_patternOpenedByType[ type ] ]: null };
	}
};
