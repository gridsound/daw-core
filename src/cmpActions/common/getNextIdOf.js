"use strict";

DAWCore.common.getNextIdOf = obj => {
	const id = Object.keys( obj )
		.reduce( ( max, id ) => Math.max( max, parseInt( id ) || 0 ), 0 );

	return `${ id + 1 }`;
};
