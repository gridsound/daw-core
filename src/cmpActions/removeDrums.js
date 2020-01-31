"use strict";

DAWCore.actions.removeDrums = function( patternId, rowId, whenFrom, whenTo ) {
	return DAWCore.actions._addDrums.call( this, false, patternId, rowId, whenFrom, whenTo );
};
