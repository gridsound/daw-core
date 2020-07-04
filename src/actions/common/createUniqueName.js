"use strict";

DAWCore.common.createUniqueName = ( collection, name, get ) => {
	const arr = Object.values( get[ collection ]() );

	return GSUtils.uniqueName( name, arr.map( obj => obj.name ) );
};
