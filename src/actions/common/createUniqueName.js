"use strict";

DAWCore.actionsCommon.createUniqueName = ( daw, collection, name ) => {
	const arr = Object.values( daw.get[ collection ]() );

	return DAWCore.utils.uniqueName( name, arr.map( obj => obj.name ) );
};
