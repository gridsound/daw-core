"use strict";

DAWCore.prototype.newSynth = function() {
	this.compositionChange( this._newSynth() );
};

DAWCore.prototype._newSynth = function() {
	const id = this._getNextIdOf( this.get.synths() ),
		name = this._createUniqueName( "synths", "synth" ),
		obj = {
			synths: { [ id ]: DAWCore.json.synth( name ) },
			synthOpened: id,
		};

	if ( this.get.patternKeysOpened() != null ) {
		obj.patternKeysOpened = null;
	}
	return obj;
};
