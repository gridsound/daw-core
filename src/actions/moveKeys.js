"use strict";

DAWCore.actions.moveKeys = ( patId, keyIds, whenIncr, keyIncr, get ) => {
	const pat = get.pattern( patId ),
		patKeys = get.keys( pat.keys ),
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
		obj = { keys: { [ pat.keys ]: keys } };

	if ( whenIncr ) {
		const duration = DAWCore.common.calcNewKeysDuration( pat.keys, keys, get );

		DAWCore.common.updatePatternDuration( obj, patId, duration, get );
	}
	return [
		obj,
		[ "keys", "moveKeys", pat.name, keyIds.length ],
	];
};
