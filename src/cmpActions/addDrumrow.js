"use strict";

DAWCore.actions.addDrumrow = function( patternId ) {
	const drumrows = this.get.drumrows(),
		patName = this.get.drumrow( patternId ).name,
		rowId = this._getNextIdOf( drumrows ),
		rowObj = {
			order: this._getNextOrderOf( drumrows ),
			toggle: true,
			pattern: patternId,
			gain: 1,
			pan: 0,
		};

	return [
		{ drumrows: { [ rowId ]: rowObj } },
		[ "drumrows", "addDrumrow", patName ],
	];
};
