"use strict";

DAWCore.actionsCommon.updatePatternDuration = ( daw, obj, patId, duration ) => {
	if ( duration !== daw.$getPattern( patId ).duration ) {
		const objBlocks = Object.entries( daw.$getBlocks() )
			.reduce( ( obj, [ id, blc ] ) => {
				if ( blc.pattern === patId && !blc.durationEdited ) {
					obj[ id ] = { duration };
				}
				return obj;
			}, {} );

		DAWCore.utils.deepAssign( obj, { patterns: { [ patId ]: { duration } } } );
		DAWCore.utils.addIfNotEmpty( obj, "blocks", objBlocks );
		if ( DAWCore.utils.isntEmpty( objBlocks ) ) {
			const dur = DAWCore.actionsCommon.calcNewDuration( daw, obj );

			if ( dur !== daw.$getDuration() ) {
				obj.duration = dur;
			}
		}
	}
};
