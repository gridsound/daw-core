"use strict";

DAWCore.actions.set( "cropEndBlocks", ( daw, blcIds, whenIncr ) => {
	const blocks = blcIds.reduce( ( obj, id ) => {
		obj[ id ] = {
			duration: daw.$getBlock( id ).duration + whenIncr,
			durationEdited: true,
		};
		return obj;
	}, {} );
	const obj = { blocks };
	const dur = DAWCore.actionsCommon.calcNewDuration( daw, obj );

	if ( dur !== daw.$getDuration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		[ "blocks", "cropEndBlocks", blcIds.length ],
	];
} );
