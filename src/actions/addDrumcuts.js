"use strict";

DAWCore.actions.set( "addDrumcuts", ( daw, patternId, rowId, whenFrom, whenTo ) => {
	return DAWCore.actions._addDrums( "drumcut", true, patternId, rowId, whenFrom, whenTo, daw );
} );
