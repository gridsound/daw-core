"use strict";

DAWCore.prototype.openSynth = function( id ) {
	if ( id !== this.get.synthOpened() ) {
		const patId = this._openSynth_find( id ),
			obj = { synthOpened: id };

		if ( patId !== this.get.patternOpened() ) {
			obj.patternOpened = patId;
		}
		this.composition.change( obj, DAWCore.composeUndo( this.get.composition(), obj ) );
	}
};

DAWCore.prototype._openSynth_find = function( id ) {
	const pat = Object.values( this.get.patterns() )
			.find( pat => pat.synth === id );

	return pat ? pat[ 0 ] : null;
};
