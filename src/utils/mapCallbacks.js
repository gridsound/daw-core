"use strict";

DAWCore.utils.mapCallbacks = ( names, fns ) => {
	const on = {};

	names.forEach( n => on[ n ] = DAWCore.utils.noop );
	Object.assign( Object.seal( on ), fns );
	return Object.freeze( on );
};
