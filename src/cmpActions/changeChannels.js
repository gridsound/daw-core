"use strict";

DAWCore.actions.changeChannels = function( channels, msg ) {
	const synths = Object.entries( this.get.synths() ),
		objSynths = {},
		obj = { channels };

	Object.entries( channels ).forEach( ( [ chanId, chanObj ] ) => {
		if ( !chanObj ) {
			synths.forEach( kv => {
				if ( kv[ 1 ].dest === chanId ) {
					objSynths[ kv[ 0 ] ] = { dest: "main" };
				}
			} );
		}
	} );
	DAWCore.utils.addIfNotEmpty( obj, "synths", objSynths );
	return [ obj, msg ];
};
