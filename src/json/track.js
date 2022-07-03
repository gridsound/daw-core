"use strict";

DAWCoreJSON.track = obj => Object.assign( Object.seal( {
	name: "",
	order: 0,
	toggle: true,
} ), obj );
