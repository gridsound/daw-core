"use strict";

DAWCore.actions.removeChannel = ( id, get ) => {
	if ( id !== "main" ) {
		const red = DAWCore.actions.removeChannel_redirect,
			channels = red( id, get.channels(), { [ id ]: undefined } ),
			patterns = red( id, get.patterns(), {} ),
			synths = red( id, get.synths(), {} ),
			obj = { channels };

		GSUtils.addIfNotEmpty( obj, "synths", synths );
		GSUtils.addIfNotEmpty( obj, "patterns", patterns );
		return [
			obj,
			[ "channels", "removeChannel", get.channel( id ).name ],
		];
	}
};

DAWCore.actions.removeChannel_redirect = ( id, list, obj ) => {
	Object.entries( list ).forEach( kv => {
		if ( kv[ 1 ].dest === id ) {
			obj[ kv[ 0 ] ] = { dest: "main" };
		}
	} );
	return obj;
};
