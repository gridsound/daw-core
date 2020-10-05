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
	}
	return [
		obj,
		[ "keys", "moveKeys", keyIds.length ],
	];
};
