"use strict";

DAWCore.actions.set( "removeDrums", ( patternId, rowId, whenFrom, whenTo, get ) => {
	return DAWCore.actions._addDrums( "drum", false, patternId, rowId, whenFrom, whenTo, get );
} );
