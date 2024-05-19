"use strict";

function DAWCoreActions_removeDrumcuts( daw, patternId, rowId, arr ) {
	return DAWCoreActions__addDrums( "drumcut", false, patternId, rowId, arr, daw );
}
