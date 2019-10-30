"use strict";

DAWCore.prototype.removePattern = function( id ) {
	const pat = this.get.pattern( id );

	pat
		? this.compositionChange( DAWCore._removePattern( this.get, id, pat ) )
		: this._error( "removePattern", "patterns", id );
};

DAWCore._removePattern = function( get, patId, pat ) {
	const obj = {
			keys: { [ pat.keys ]: undefined },
			patterns: { [ patId ]: undefined },
		},
		blocks = Object.entries( get.blocks() ).reduce( ( blocks, [ blcId, blc ] ) => {
			if ( blc.pattern === patId ) {
				blocks[ blcId ] = undefined;
			}
			return blocks;
		}, {} );

	if ( GSData.isntEmpty( blocks ) ) {
		const realDur = Object.values( get.blocks() )
				.reduce( ( dur, blc ) => {
					return blc.pattern === patId
						? dur
						: Math.max( dur, blc.when + blc.duration );
				}, 0 ),
			bPM = get.beatsPerMeasure(),
			dur = Math.max( 1, Math.ceil( realDur / bPM ) ) * bPM;

		obj.blocks = blocks;
		if ( dur !== get.duration() ) {
			obj.duration = dur;
		}
	}
	if ( patId === get.patternKeysOpened() ) {
		if ( !Object.entries( get.patterns() ).some( ( [ k, v ] ) => {
			if ( k !== patId && v.synth === pat.synth ) {
				obj.patternKeysOpened = k;
				return true;
			}
		} ) ) {
			obj.patternKeysOpened = null;
		}
	}
	return obj;
};
