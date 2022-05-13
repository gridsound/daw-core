"use strict";

DAWCore.actions.set( "cropEndKeys", ( daw, patId, keyIds, durIncr ) => {
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
	const duration = DAWCore.actionsCommon.calcNewKeysDuration( daw, pat.keys, keys );

	DAWCore.actionsCommon.updatePatternDuration( daw, obj, patId, duration );
	return [
		obj,
		[ "keys", "cropEndKeys", pat.name, keyIds.length ],
	];
} );
