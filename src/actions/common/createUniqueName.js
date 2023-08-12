"use strict";

DAWCoreActionsCommon.createUniqueName = ( list, name ) => {
	return GSUuniqueName( name, Object.values( list ).map( obj => obj.name ) );
};
