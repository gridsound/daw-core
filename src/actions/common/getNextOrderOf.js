"use strict";

DAWCoreActionsCommon.getNextOrderOf = obj => {
	return Object.values( obj )
		.reduce( ( max, item ) => Math.max( max, item.order ), -1 ) + 1;
};
