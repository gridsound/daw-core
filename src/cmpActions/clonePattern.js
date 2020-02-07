"use strict";

DAWCore.actions.clonePattern = function( patId, get ) {
	const pat = get.pattern( patId ),
		type = pat.type,
		newPat = Object.assign( {}, pat ),
		newPatId = DAWCore.common.getNextIdOf( get.patterns() ),
		obj = { patterns: { [ newPatId ]: newPat } };

	newPat.name = this._createUniqueName( "patterns", pat.name );
	if ( type === "keys" || type === "drums" ) {
		const newCnt = GSData.deepCopy( get[ type ]( pat[ type ] ) ),
			newCntId = DAWCore.common.getNextIdOf( get[ type ]() );

		newPat[ type ] = newCntId;
		obj[ type ] = { [ newCntId ]: newCnt };
		obj[ type === "keys"
			? "patternKeysOpened"
			: "patternDrumsOpened" ] = newPatId;
	}
	return [
		obj,
		[ "patterns", "clonePattern", newPat.type, newPat.name, pat.name ],
	];
};
