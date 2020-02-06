"use strict";

DAWCore.actions.addDrumrow = function( pattern ) {
	const drumrows = this.get.drumrows(),
		patName = this.get.pattern( pattern ).name,
		rowId = this._getNextIdOf( drumrows ),
		rowObj = {
			order: this._getNextOrderOf( drumrows ),
			toggle: true,
			pattern,
			gain: 1,
			pan: 0,
		};

	return [
		{ drumrows: { [ rowId ]: rowObj } },
		[ "drumrows", "addDrumrow", patName ],
	];
};
