"use strict";

DAWCore.actions.set( "removeDrums", ( patternId, rowId, whenFrom, whenTo, _get, daw ) => {
	return DAWCore.actions._addDrums( "drum", false, patternId, rowId, whenFrom, whenTo, daw );
} );
