"use strict";

DAWCore.prototype.changePatternSynth = function( id, synth ) {
	const pat = this.get.pattern( id );

	if ( !pat ) {
		this._error( "changePatternSynth", "patterns", id );
	} else if ( pat.synth !== synth ) {
		const obj = { patterns: { [ id ]: { synth } } };

		if ( id === this.get.patternKeysOpened() ) {
			obj.synthOpened = synth;
		}
		this.compositionChange( obj );
	}
};
