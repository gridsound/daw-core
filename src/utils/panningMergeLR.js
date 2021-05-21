"use strict";

DAWCore.utils.panningMergeLR = ( l, r ) => {
	return (
		l > r ? -1 + r / l :
		l < r ?  1 - l / r : 0
	);
};
