"use strict";

DAWCoreActions.addDrumcuts = ( daw, patternId, rowId, arr ) => {
	return DAWCoreActions._addDrums( "drumcut", true, patternId, rowId, arr, daw );
};
