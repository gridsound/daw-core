"use strict";

DAWCore.prototype.openPattern = function( id ) {
	const pat = this.get.pattern( id );
	let obj;

	switch ( pat.type ) {
		case "drums":
			if ( id !== this.get.patternDrumsOpened() ) {
				obj = { patternDrumsOpened: id };
			}
			break;
		case "keys":
			if ( id !== this.get.patternKeysOpened() ) {
				obj = { patternKeysOpened: id };
				if ( pat.synth !== this.get.synthOpened() ) {
					obj.synthOpened = pat.synth;
				}
			}
			break;
	}
	if ( obj ) {
		this.composition.change( obj, DAWCore.utils.composeUndo( this.get.composition(), obj ) );
	}
};
