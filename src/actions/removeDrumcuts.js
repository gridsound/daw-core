"use strict";

DAWCore.actions.set( "removeDrumcuts", ( daw, patternId, rowId, whenFrom, whenTo ) => {
	return DAWCore.actions._addDrums( "drumcut", false, patternId, rowId, whenFrom, whenTo, daw );
} );
