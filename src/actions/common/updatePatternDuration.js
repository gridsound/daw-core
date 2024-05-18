"use strict";

function DAWCoreActionsCommon_updatePatternDuration( daw, obj, patId, duration ) {
	if ( duration !== daw.$getPattern( patId ).duration ) {
		const objBlocks = Object.entries( daw.$getBlocks() )
			.reduce( ( obj, [ id, blc ] ) => {
				if ( blc.pattern === patId && !blc.durationEdited ) {
					obj[ id ] = { duration };
				}
				return obj;
			}, {} );

		GSUdeepAssign( obj, { patterns: { [ patId ]: { duration } } } );
		GSUaddIfNotEmpty( obj, "blocks", objBlocks );
		if ( GSUisntEmpty( objBlocks ) ) {
			const dur = DAWCoreActionsCommon_calcNewDuration( daw, obj );

			if ( dur !== daw.$getDuration() ) {
				obj.duration = dur;
			}
		}
	}
}
