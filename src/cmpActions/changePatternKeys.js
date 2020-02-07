"use strict";

DAWCore.actions.changePatternKeys = function( patId, keysObj, duration ) {
	const pat = this.get.pattern( patId ),
		keys = this.get.keys( pat.keys ),
		obj = { keys: { [ pat.keys ]: keysObj } };

	if ( duration !== pat.duration ) {
		const objPatterns = { [ patId ]: { duration } },
			cmpDur = DAWCore.common.calcNewDuration( this.get, objPatterns ),
			objBlocks = Object.entries( this.get.blocks() )
				.reduce( ( obj, [ id, blc ] ) => {
					if ( blc.pattern === patId && !blc.durationEdited ) {
						obj[ id ] = { duration };
					}
					return obj;
				}, {} );

		obj.patterns = objPatterns;
		DAWCore.utils.addIfNotEmpty( obj, "blocks", objBlocks );
		if ( Math.abs( cmpDur - this.get.duration() ) > .001 ) {
			obj.duration = cmpDur;
		}
	}
	return [
		obj,
	];
};
