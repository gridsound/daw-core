"use strict";

DAWCore.actions.changeChannels = ( channels, msg, get ) => {
	const synths = Object.entries( get.synths() ),
		patterns = Object.entries( get.patterns() )
			.filter( kv => kv[ 1 ].type === "buffer" ),
		objSynths = {},
		objPatterns = {},
		obj = { channels };

	Object.entries( channels ).forEach( ( [ chanId, chanObj ] ) => {
		if ( !chanObj ) {
			synths.forEach( kv => {
				if ( kv[ 1 ].dest === chanId ) {
					objSynths[ kv[ 0 ] ] = { dest: "main" };
				}
			} );
			patterns.forEach( kv => {
				if ( kv[ 1 ].dest === chanId ) {
					objPatterns[ kv[ 0 ] ] = { dest: "main" };
				}
			} );
		}
	} );
	DAWCore.utils.addIfNotEmpty( obj, "synths", objSynths );
	DAWCore.utils.addIfNotEmpty( obj, "patterns", objPatterns );
	return [ obj, msg ];
};
