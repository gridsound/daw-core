"use strict";

DAWCoreActions.set( "removeDrumcuts", ( daw, patternId, rowId, whenFrom, whenTo ) => {
	return DAWCoreActions._addDrums( "drumcut", false, patternId, rowId, whenFrom, whenTo, daw );
} );
