"use strict";

DAWCoreActions.set( "moveKeys", ( daw, patId, keyIds, whenIncr, keyIncr ) => {
	const pat = daw.$getPattern( patId );
	const patKeys = daw.$getKeys( pat.keys );
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
		const duration = DAWCoreActionsCommon.calcNewKeysDuration( daw, pat.keys, keys );

		DAWCoreActionsCommon.updatePatternDuration( daw, obj, patId, duration );
	}
	return [
		obj,
		[ "keys", "moveKeys", pat.name, keyIds.length ],
	];
} );
