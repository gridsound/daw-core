"use strict";

DAWCoreActionsCommon.createUniqueName = ( list, name ) => {
	return DAWCoreUtils.$uniqueName( name, Object.values( list ).map( obj => obj.name ) );
};
