"use strict";

DAWCoreActions.cropEndKeys = ( daw, patId, keyIds, durIncr ) => {
	const pat = daw.$getPattern( patId );
	const patKeys = daw.$getKeys( pat.keys );
	const keys = keyIds.reduce( ( obj, id ) => {
		const k = patKeys[ id ];
		const attRel = k.attack + k.release;
		const duration = k.duration + durIncr;
		const o = { duration };

		obj[ id ] = o;
		if ( duration < attRel ) {
			o.attack = +( k.attack / attRel * duration ).toFixed( 3 );
			o.release = +( k.release / attRel * duration ).toFixed( 3 );
		}
		return obj;
	}, {} );
	const obj = { keys: { [ pat.keys ]: keys } };
	const duration = DAWCoreActionsCommon_calcNewKeysDuration( daw, pat.keys, keys );

	DAWCoreActionsCommon_updatePatternDuration( daw, obj, patId, duration );
	return [
		obj,
		[ "keys", "cropEndKeys", pat.name, keyIds.length ],
	];
};
