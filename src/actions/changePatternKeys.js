"use strict";

DAWCore.prototype.changePatternKeys = function( patId, keysObj, patDur ) {
	const pat = this.get.pattern( patId );

	if ( !pat ) {
		this._error( "changePatternKeys", "pattern", patId );
	} else {
		const keys = this.get.keys( pat.keys ),
			obj = this._changePatternKeys( patId, keysObj, pat, patDur );

		this.compositionChange( obj );
	}
};

DAWCore.prototype._changePatternKeys = function( patId, keysObj, pat, duration ) {
	const obj = { keys: { [ pat.keys ]: keysObj } };

	if ( duration !== pat.duration ) {
		const objPatterns = { [ patId ]: { duration } },
			cmpDur = this.composition.getNewDuration( objPatterns ),
			objBlocks = Object.entries( this.get.blocks() )
				.reduce( ( obj, [ id, blc ] ) => {
					if ( blc.pattern === patId && !blc.durationEdited ) {
						obj[ id ] = { duration };
					}
					return obj;
				}, {} );

		obj.patterns = objPatterns;
		if ( GSData.isntEmpty( objBlocks ) ) {
			obj.blocks = objBlocks;
		}
		if ( Math.abs( cmpDur - this.get.duration() ) > .001 ) {
			obj.duration = cmpDur;
		}
	}
	return obj;
};
