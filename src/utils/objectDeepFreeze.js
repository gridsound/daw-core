"use strict";

DAWCore.objectDeepFreeze = obj => {
	if ( obj && typeof obj === "object" && !Array.isArray( obj ) ) {
		Object.values( obj ).forEach( val => DAWCore.freezeObject( val ) );
	}
	return Object.freeze( obj );
};
