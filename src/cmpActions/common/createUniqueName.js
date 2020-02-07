"use strict";

DAWCore.common.createUniqueName = ( collection, name, get ) => {
	const arr = Object.values( get[ collection ]() );

	return DAWCore.uniqueName( name, arr.map( obj => obj.name ) );
};
