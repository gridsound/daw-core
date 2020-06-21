"use strict";

DAWCore.actions.removeDrumcuts = ( patternId, rowId, whenFrom, whenTo, get ) => {
	return DAWCore.actions._addDrums( "drumcut", false, patternId, rowId, whenFrom, whenTo, get );
};
