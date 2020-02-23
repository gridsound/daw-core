"use strict";

DAWCore.prototype.closePattern = function( type ) {
	const attr = type === "keys"
			? "patternKeysOpened"
			: type === "drums"
				? "patternDrumsOpened"
				: "patternBufferOpened"

	if ( this.get[ attr ]() ) {
		const obj = { [ attr ]: null };

		this.composition.change( obj, GSUtils.composeUndo( this.get.composition(), obj ) );
	}
};
