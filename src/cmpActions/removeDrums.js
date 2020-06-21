"use strict";

DAWCore.actions.removeDrums = ( patternId, rowId, whenFrom, whenTo, get ) => {
	return DAWCore.actions._addDrums( "drum", false, patternId, rowId, whenFrom, whenTo, get );
};
