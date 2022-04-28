"use strict";

DAWCore.actions.set( "removeDrumcuts", ( patternId, rowId, whenFrom, whenTo, get ) => {
	return DAWCore.actions._addDrums( "drumcut", false, patternId, rowId, whenFrom, whenTo, get );
} );
