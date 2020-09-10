"use strict";

DAWCore.actions.cropEndBlocks = ( blcIds, whenIncr, get ) => {
	const blocks = blcIds.reduce( ( obj, id ) => {
			obj[ id ] = {
				duration: get.block( id ).duration + whenIncr,
				durationEdited: true,
			};
			return obj;
		}, {} ),
		obj = { blocks },
		dur = DAWCore.common.calcNewDuration( obj, get );

	if ( dur !== get.duration() ) {
		obj.duration = dur;
	}
	return [
		obj,
		[ "blocks", "cropEndBlocks", blcIds.length ],
	];
};
