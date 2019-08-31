"use strict";

DAWCore.prototype.changeChannels = function( objChannels, actionMsg ) {
	const synths = Object.entries( this.get.synths() ),
		objSynths = {},
		obj = { channels: objChannels };

	Object.entries( objChannels ).forEach( ( [ chanId, chanObj ] ) => {
		if ( !chanObj ) {
			synths.forEach( kv => {
				if ( kv[ 1 ].dest === chanId ) {
					objSynths[ kv[ 0 ] ] = { dest: "main" };
				}
			} );
		}
	} );
	if ( !DAWCore.objectIsEmpty( objSynths ) ) {
		obj.synths = objSynths;
	}
	this.compositionChange( obj, actionMsg );
};
