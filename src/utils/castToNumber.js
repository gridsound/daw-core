"use strict";

DAWCoreUtils.$castToNumber = ( n, def, min, max, fix ) => {
	const x = Number.isFinite( +n )
		? Math.max( min, Math.min( n, max ) )
		: def;

	return typeof fix === "number"
		? +x.toFixed( 2 )
		: +x;
};
