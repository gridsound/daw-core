"use strict";

DAWCore.prototype.changePatternSynth = function( id, synth ) {
	if ( this.get.pattern( id ).synth !== synth ) {
		const obj = { patterns: { [ id ]: { synth } } };

		if ( id === this.get.patternKeysOpened() ) {
			obj.synthOpened = synth;
		}
		this.compositionChange( obj );
	}
};
