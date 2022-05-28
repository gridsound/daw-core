"use strict";

DAWCore.actionsCommon.getNextIdOf = list => {
	const id = Object.keys( list ).reduce( ( max, id ) => Math.max( max, +id || 0 ), 0 );

	return `${ id + 1 }`;
};
