"use strict";

DAWCoreActionsCommon.updatePatternDuration = ( daw, obj, patId, duration ) => {
	if ( duration !== daw.$getPattern( patId ).duration ) {
		const objBlocks = Object.entries( daw.$getBlocks() )
			.reduce( ( obj, [ id, blc ] ) => {
				if ( blc.pattern === patId && !blc.durationEdited ) {
					obj[ id ] = { duration };
				}
				return obj;
			}, {} );

		DAWCoreUtils.$deepAssign( obj, { patterns: { [ patId ]: { duration } } } );
		DAWCoreUtils.$addIfNotEmpty( obj, "blocks", objBlocks );
		if ( DAWCoreUtils.$isntEmpty( objBlocks ) ) {
			const dur = DAWCoreActionsCommon.calcNewDuration( daw, obj );

			if ( dur !== daw.$getDuration() ) {
				obj.duration = dur;
			}
		}
	}
};
