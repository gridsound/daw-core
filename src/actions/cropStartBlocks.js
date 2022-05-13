"use strict";

DAWCore.actions.set( "cropStartBlocks", ( daw, blcIds, whenIncr ) => {
	const blocks = blcIds.reduce( ( obj, id ) => {
		const blc = daw.get.block( id );

		obj[ id ] = {
			when: blc.when + whenIncr,
			offset: blc.offset + whenIncr,
			duration: blc.duration - whenIncr,
			durationEdited: true,
		};
		return obj;
	}, {} );

	return [
		{ blocks },
		[ "blocks", "cropStartBlocks", blcIds.length ],
	];
} );
