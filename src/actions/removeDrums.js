"use strict";

DAWCoreActions.set( "removeDrums", ( daw, patternId, rowId, whenFrom, whenTo ) => {
	return DAWCoreActions._addDrums( "drum", false, patternId, rowId, whenFrom, whenTo, daw );
} );
