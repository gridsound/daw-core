"use strict";

DAWCore.actions.set( "addDrumcuts", ( patternId, rowId, whenFrom, whenTo, get ) => {
	return DAWCore.actions._addDrums( "drumcut", true, patternId, rowId, whenFrom, whenTo, get );
} );
