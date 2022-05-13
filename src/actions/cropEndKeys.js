"use strict";

DAWCore.actions.set( "cropEndKeys", ( patId, keyIds, durIncr, _get, daw ) => {
	const pat = daw.get.pattern( patId );
	const patKeys = daw.get.keys( pat.keys );
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
	const duration = DAWCore.actionsCommon.calcNewKeysDuration( pat.keys, keys, daw );

	DAWCore.actionsCommon.updatePatternDuration( obj, patId, duration, daw );
	return [
		obj,
		[ "keys", "cropEndKeys", pat.name, keyIds.length ],
	];
} );
