"use strict";

DAWCoreActions.removeDrumcuts = ( daw, patternId, rowId, arr ) => {
	return DAWCoreActions._addDrums( "drumcut", false, patternId, rowId, arr, daw );
};
