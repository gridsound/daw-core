"use strict";

DAWCore.actions.set( "removeDrums", ( daw, patternId, rowId, whenFrom, whenTo ) => {
	return DAWCore.actions._addDrums( "drum", false, patternId, rowId, whenFrom, whenTo, daw );
} );
