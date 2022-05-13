"use strict";

DAWCore.actionsCommon.updatePatternDuration = ( obj, patId, duration, daw ) => {
	if ( duration !== daw.get.pattern( patId ).duration ) {
		const objBlocks = Object.entries( daw.get.blocks() )
			.reduce( ( obj, [ id, blc ] ) => {
				if ( blc.pattern === patId && !blc.durationEdited ) {
					obj[ id ] = { duration };
				}
				return obj;
			}, {} );

		DAWCore.utils.deepAssign( obj, { patterns: { [ patId ]: { duration } } } );
		DAWCore.utils.addIfNotEmpty( obj, "blocks", objBlocks );
		if ( DAWCore.utils.isntEmpty( objBlocks ) ) {
			const dur = DAWCore.actionsCommon.calcNewDuration( obj, daw );

			if ( dur !== daw.get.duration() ) {
				obj.duration = dur;
			}
		}
	}
};
