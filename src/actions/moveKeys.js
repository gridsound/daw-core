"use strict";

DAWCore.actions.set( "moveKeys", ( patId, keyIds, whenIncr, keyIncr, _get, daw ) => {
	const pat = daw.get.pattern( patId );
	const patKeys = daw.get.keys( pat.keys );
	const keys = keyIds.reduce( ( obj, id ) => {
		const k = patKeys[ id ];
		const o = {};

		obj[ id ] = o;
		if ( whenIncr ) {
			o.when = k.when + whenIncr;
		}
		if ( keyIncr ) {
			o.key = k.key - keyIncr;
		}
		return obj;
	}, {} );
	const obj = { keys: { [ pat.keys ]: keys } };

	if ( whenIncr ) {
		const duration = DAWCore.actionsCommon.calcNewKeysDuration( pat.keys, keys, daw );

		DAWCore.actionsCommon.updatePatternDuration( obj, patId, duration, daw );
	}
	return [
		obj,
		[ "keys", "moveKeys", pat.name, keyIds.length ],
	];
} );
