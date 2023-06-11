"use strict";

DAWCoreActions.set( "removeDrums", ( daw, patternId, rowId, arr ) => {
	return DAWCoreActions._addDrums( "drum", false, patternId, rowId, arr, daw );
} );
