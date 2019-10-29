"use strict";

DAWCore.prototype.openPattern = function( id ) {
	const pat = this.get.pattern( id );

	if ( pat.type === "keys" && id !== this.get.patternKeysOpened() ) {
		const obj = { patternKeysOpened: id };

		if ( pat.synth !== this.get.synthOpened() ) {
			obj.synthOpened = pat.synth;
		}
		this.composition.change( obj, DAWCore.composeUndo( this.get.composition(), obj ) );
	}
};
