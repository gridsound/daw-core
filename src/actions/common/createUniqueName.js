"use strict";

DAWCore.actionsCommon.createUniqueName = ( collection, name, get ) => {
	const arr = Object.values( get[ collection ]() );

	return DAWCore.utils.uniqueName( name, arr.map( obj => obj.name ) );
};
