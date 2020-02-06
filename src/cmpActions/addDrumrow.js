"use strict";

DAWCore.actions.addDrumrow = function( pattern ) {
	const pat = this.get.pattern( pattern );

	if ( pat.type === "buffer" ) {
		const drumrows = this.get.drumrows(),
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
			[ "drumrows", "addDrumrow", pat.name ],
		];
	}
};
