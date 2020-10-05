"use strict";

DAWCore.actions.cropEndKeys = ( patId, keyIds, durIncr, get ) => {
	const pat = get.pattern( patId ),
		patKeys = get.keys( pat.keys ),
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
		obj = { keys: { [ pat.keys ]: keys } },
		duration = DAWCore.common.calcNewKeysDuration( pat.keys, keys, get );

	if ( duration !== pat.duration ) {
		const objPatterns = { [ patId ]: { duration } },
			objBlocks = Object.entries( get.blocks() )
				.reduce( ( obj, [ id, blc ] ) => {
					if ( blc.pattern === patId && !blc.durationEdited ) {
						obj[ id ] = { duration };
					}
					return obj;
				}, {} );

		obj.patterns = objPatterns;
		GSUtils.addIfNotEmpty( obj, "blocks", objBlocks );
		if ( GSUtils.isntEmpty( objBlocks ) ) {
			const dur = DAWCore.common.calcNewDuration( obj, get );

			if ( dur !== get.duration() ) {
				obj.duration = dur;
			}
		}
	}
	return [
		obj,
		[ "keys", "cropEndKeys", keyIds.length ],
	];
};
