"use strict";

DAWCoreUtils.$mapCallbacks = ( names, fns ) => {
	const on = {};

	names.forEach( n => on[ n ] = DAWCoreUtils.$noop );
	Object.assign( Object.seal( on ), fns );
	return Object.freeze( on );
};
