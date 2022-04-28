"use strict";

DAWCore.actions.moveKeys = ( patId, keyIds, whenIncr, keyIncr, get ) => {
	const pat = get.pattern( patId );
	const patKeys = get.keys( pat.keys );
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
		const duration = DAWCore.actionsCommon.calcNewKeysDuration( pat.keys, keys, get );

		DAWCore.actionsCommon.updatePatternDuration( obj, patId, duration, get );
	}
	return [
		obj,
		[ "keys", "moveKeys", pat.name, keyIds.length ],
	];
};
