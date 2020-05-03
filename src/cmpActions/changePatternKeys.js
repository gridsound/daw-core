"use strict";

DAWCore.actions.changePatternKeys = ( patId, keysObj, duration, get ) => {
	const pat = get.pattern( patId ),
		obj = { keys: { [ pat.keys ]: keysObj } };

	if ( duration !== pat.duration ) {
		const objPatterns = { [ patId ]: { duration } },
			cmpDur = DAWCore.common.calcNewDuration( objPatterns, get ),
			objBlocks = Object.entries( get.blocks() )
				.reduce( ( obj, [ id, blc ] ) => {
					if ( blc.pattern === patId && !blc.durationEdited ) {
						obj[ id ] = { duration };
					}
					return obj;
				}, {} );

		obj.patterns = objPatterns;
		GSUtils.addIfNotEmpty( obj, "blocks", objBlocks );
		if ( Math.abs( cmpDur - get.duration() ) > .001 ) {
			obj.duration = cmpDur;
		}
	}
	return [
		obj,
	];
};
