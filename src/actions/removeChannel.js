"use strict";

DAWCore.actions.set( "removeChannel", ( daw, id ) => {
	if ( id !== "main" ) {
		const red = DAWCore.actions.removeChannel_redirect;
		const destMain = { dest: "main" };
		const channels = red( id, daw.$getChannels(), { [ id ]: undefined }, destMain );
		const patterns = red( id, daw.$getPatterns(), {}, destMain );
		const effects = red( id, daw.$getEffects(), {}, undefined );
		const synths = red( id, daw.$getSynths(), {}, destMain );
		const obj = { channels };

		DAWCore.utils.addIfNotEmpty( obj, "synths", synths );
		DAWCore.utils.addIfNotEmpty( obj, "effects", effects );
		DAWCore.utils.addIfNotEmpty( obj, "patterns", patterns );
		return [
			obj,
			[ "channels", "removeChannel", daw.$getChannel( id ).name ],
		];
	}
} );

DAWCore.actions.removeChannel_redirect = ( chanId, list, obj, val ) => {
	return Object.entries( list ).reduce( ( obj, kv ) => {
		if ( kv[ 1 ].dest === chanId ) {
			obj[ kv[ 0 ] ] = val;
		}
		return obj;
	}, obj );
};
