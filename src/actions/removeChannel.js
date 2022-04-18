"use strict";

DAWCore.actions.removeChannel = ( id, get ) => {
	if ( id !== "main" ) {
		const red = DAWCore.actions.removeChannel_redirect;
		const destMain = { dest: "main" };
		const channels = red( id, get.channels(), { [ id ]: undefined }, destMain );
		const patterns = red( id, get.patterns(), {}, destMain );
		const effects = red( id, get.effects(), {}, undefined );
		const synths = red( id, get.synths(), {}, destMain );
		const obj = { channels };

		DAWCore.utils.addIfNotEmpty( obj, "synths", synths );
		DAWCore.utils.addIfNotEmpty( obj, "effects", effects );
		DAWCore.utils.addIfNotEmpty( obj, "patterns", patterns );
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
