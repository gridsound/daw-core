"use strict";

DAWCore.utils.panningMerge = ( ...pans ) => {
	const lr = pans.map( DAWCore.utils.panningSplitLR )
		.reduce( ( ret, lr ) => {
			ret[ 0 ] *= lr[ 0 ];
			ret[ 1 ] *= lr[ 1 ];
			return ret;
		}, [ 1, 1 ] );

	return DAWCore.utils.panningMergeLR( ...lr );
};
