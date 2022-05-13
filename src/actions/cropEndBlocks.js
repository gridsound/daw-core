"use strict";

DAWCore.actions.set( "cropEndBlocks", ( blcIds, whenIncr, _get, daw ) => {
	const blocks = blcIds.reduce( ( obj, id ) => {
		obj[ id ] = {
			duration: daw.get.block( id ).duration + whenIncr,
			durationEdited: true,
		};
		return obj;
	}, {} );
	const obj = { blocks };
	const dur = DAWCore.actionsCommon.calcNewDuration( obj, daw );

	if ( dur !== daw.get.duration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		[ "blocks", "cropEndBlocks", blcIds.length ],
	];
} );
