"use strict";

DAWCore.actions.removeChannel = ( id, get ) => {
	if ( id !== "main" ) {
		const red = DAWCore.actions.removeChannel_redirect,
			destMain = { dest: "main" },
			channels = red( id, get.channels(), { [ id ]: undefined }, destMain ),
			patterns = red( id, get.patterns(), {}, destMain ),
			effects = red( id, get.effects(), {}, undefined ),
			synths = red( id, get.synths(), {}, destMain ),
			obj = { channels };

		GSUtils.addIfNotEmpty( obj, "synths", synths );
		GSUtils.addIfNotEmpty( obj, "effects", effects );
		GSUtils.addIfNotEmpty( obj, "patterns", patterns );
		return [
			obj,
			[ "channels", "removeChannel", get.channel( id ).name ],
		];
	}
};

DAWCore.actions.removeChannel_redirect = ( chanId, list, obj, val ) => {
	return Object.entries( list ).reduce( ( obj, kv ) => {
		if ( kv[ 1 ].dest === chanId ) {
			obj[ kv[ 0 ] ] = val;
		}
		return obj;
	}, obj );
};
