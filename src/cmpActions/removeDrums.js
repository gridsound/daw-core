"use strict";

DAWCore.actions.removeDrums = ( patternId, rowId, whenFrom, whenTo, get ) => {
	return DAWCore.actions._addDrums( false, patternId, rowId, whenFrom, whenTo, get );
};
