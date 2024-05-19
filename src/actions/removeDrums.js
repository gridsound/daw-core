"use strict";

function DAWCoreActions_removeDrums( daw, patternId, rowId, arr ) {
	return DAWCoreActions__addDrums( "drum", false, patternId, rowId, arr, daw );
}
