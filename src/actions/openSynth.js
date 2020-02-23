"use strict";

DAWCore.prototype.openSynth = function( id ) {
	if ( id !== this.get.synthOpened() ) {
		const patId = this._openSynth_find( id ),
			obj = { synthOpened: id };

		if ( patId !== this.get.patternKeysOpened() ) {
			obj.patternKeysOpened = patId;
		}
		this.composition.change( obj, GSUtils.composeUndo( this.get.composition(), obj ) );
	}
};

DAWCore.prototype._openSynth_find = function( synthId ) {
	const pats = Object.entries( this.get.patterns() ),
		pat = pats.find( kv => kv[ 1 ].synth === synthId );

	return pat ? pat[ 0 ] : null;
};
