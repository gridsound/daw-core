"use strict";

function DAWCoreActionsCommon_createUniqueName( list, name ) {
	return GSUuniqueName( name, Object.values( list ).map( obj => obj.name ) );
}
