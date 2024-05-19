"use strict";

function DAWCoreActions_addDrumcuts( daw, patternId, rowId, arr ) {
	return DAWCoreActions__addDrums( "drumcut", true, patternId, rowId, arr, daw );
}
