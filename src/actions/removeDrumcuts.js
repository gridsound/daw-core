"use strict";

DAWCore.actions.set( "removeDrumcuts", ( patternId, rowId, whenFrom, whenTo, _get, daw ) => {
	return DAWCore.actions._addDrums( "drumcut", false, patternId, rowId, whenFrom, whenTo, daw );
} );
