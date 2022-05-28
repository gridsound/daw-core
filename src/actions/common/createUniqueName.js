"use strict";

DAWCore.actionsCommon.createUniqueName = ( list, name ) => {
	return DAWCore.utils.uniqueName( name, Object.values( list ).map( obj => obj.name ) );
};
