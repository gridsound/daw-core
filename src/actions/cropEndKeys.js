"use strict";

DAWCore.actions.cropEndKeys = ( patId, keyIds, durIncr, get ) => {
	const keysId = get.pattern( patId ).keys,
		patKeys = get.keys( keysId ),
		keys = keyIds.reduce( ( obj, id ) => {
			const k = patKeys[ id ],
				attRel = k.attack + k.release,
				duration = k.duration + durIncr,
				o = { duration };

			obj[ id ] = o;
			if ( duration < attRel ) {
				o.attack = +( k.attack / attRel * duration ).toFixed( 3 );
				o.release = +( k.release / attRel * duration ).toFixed( 3 );
			}
			return obj;
		}, {} ),
		obj = { keys: { [ keysId ]: keys } },
		duration = DAWCore.common.calcNewKeysDuration( keysId, keys, get );

	DAWCore.common.updatePatternDuration( obj, patId, duration, get );
	return [
		obj,
		[ "keys", "cropEndKeys", keyIds.length ],
	];
};
