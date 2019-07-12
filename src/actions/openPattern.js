"use strict";

DAWCore.prototype.openPattern = function( id ) {
	if ( id !== this.get.patternKeysOpened() ) {
		const synId = this.get.pattern( id ).synth,
			obj = { patternKeysOpened: id };

		if ( synId !== this.get.synthOpened() ) {
			obj.synthOpened = synId;
		}
		this.composition.change( obj, DAWCore.composeUndo( this.get.composition(), obj ) );
	}
};
