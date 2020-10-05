"use strict";

DAWCore.actions.moveKeys = ( patId, keyIds, whenIncr, keyIncr, get ) => {
	const keysId = get.pattern( patId ).keys,
		patKeys = get.keys( keysId ),
		keys = keyIds.reduce( ( obj, id ) => {
			const k = patKeys[ id ],
				o = {};

			obj[ id ] = o;
			if ( whenIncr ) {
				o.when = k.when + whenIncr;
			}
			if ( keyIncr ) {
				o.key = k.key - keyIncr;
			}
			return obj;
		}, {} ),
		obj = { keys: { [ keysId ]: keys } };

	if ( whenIncr ) {
		const duration = DAWCore.common.calcNewKeysDuration( keysId, keys, get );

		DAWCore.common.updatePatternDuration( obj, patId, duration, get );
	}
	return [
		obj,
		[ "keys", "moveKeys", keyIds.length ],
	];
};
