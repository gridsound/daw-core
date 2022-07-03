"use strict";

DAWCoreActions.set( "addDrumcuts", ( daw, patternId, rowId, whenFrom, whenTo ) => {
	return DAWCoreActions._addDrums( "drumcut", true, patternId, rowId, whenFrom, whenTo, daw );
} );
