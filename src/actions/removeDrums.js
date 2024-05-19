"use strict";

DAWCoreActions.removeDrums = ( daw, patternId, rowId, arr ) => {
	return DAWCoreActions._addDrums( "drum", false, patternId, rowId, arr, daw );
};
