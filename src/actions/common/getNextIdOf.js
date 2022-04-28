"use strict";

DAWCore.actionsCommon.getNextIdOf = obj => {
	const id = Object.keys( obj )
		.reduce( ( max, id ) => Math.max( max, +id || 0 ), 0 );

	return `${ id + 1 }`;
};
