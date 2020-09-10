"use strict";

DAWCore.actions.changePatternKeys = ( patId, keysObj, duration, get ) => {
	const pat = get.pattern( patId ),
		obj = { keys: { [ pat.keys ]: keysObj } };

	if ( duration !== pat.duration ) {
		const objPatterns = { [ patId ]: { duration } },
			objBlocks = Object.entries( get.blocks() )
				.reduce( ( obj, [ id, blc ] ) => {
					if ( blc.pattern === patId && !blc.durationEdited ) {
						obj[ id ] = { duration };
					}
					return obj;
				}, {} );

		obj.patterns = objPatterns;
		GSUtils.addIfNotEmpty( obj, "blocks", objBlocks );
		if ( GSUtils.isntEmpty( objBlocks ) ) {
			const dur = DAWCore.common.calcNewDuration( obj, get );

			if ( dur !== get.duration() ) {
				obj.duration = dur;
			}
		}
	}
	return [
		obj,
	];
};
