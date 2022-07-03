"use strict";

DAWCoreActionsCommon.createUniqueName = ( list, name ) => {
	return DAWCore.utils.uniqueName( name, Object.values( list ).map( obj => obj.name ) );
};
