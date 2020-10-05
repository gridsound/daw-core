"use strict";

DAWCore.common.updatePatternDuration = ( obj, patId, duration, get ) => {
	if ( duration !== get.pattern( patId ).duration ) {
		const objBlocks = Object.entries( get.blocks() )
				.reduce( ( obj, [ id, blc ] ) => {
					if ( blc.pattern === patId && !blc.durationEdited ) {
						obj[ id ] = { duration };
					}
					return obj;
				}, {} );

		obj.patterns = { [ patId ]: { duration } };
		GSUtils.addIfNotEmpty( obj, "blocks", objBlocks );
		if ( GSUtils.isntEmpty( objBlocks ) ) {
			const dur = DAWCore.common.calcNewDuration( obj, get );

			if ( dur !== get.duration() ) {
				obj.duration = dur;
			}
		}
	}
};
