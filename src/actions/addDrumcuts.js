"use strict";

DAWCore.actions.set( "addDrumcuts", ( patternId, rowId, whenFrom, whenTo, _get, daw ) => {
	return DAWCore.actions._addDrums( "drumcut", true, patternId, rowId, whenFrom, whenTo, daw );
} );
