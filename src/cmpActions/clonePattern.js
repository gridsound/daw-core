"use strict";

DAWCore.actions.clonePattern = function( patId ) {
	const pat = this.get.pattern( patId ),
		type = pat.type,
		newPat = Object.assign( {}, pat ),
		newPatId = this._getNextIdOf( this.get.patterns() ),
		obj = { patterns: { [ newPatId ]: newPat } };

	newPat.name = this._createUniqueName( "patterns", pat.name );
	if ( type === "keys" || type === "drums" ) {
		const newCnt = GSData.deepCopy( this.get[ type ]( pat[ type ] ) ),
			newCntId = this._getNextIdOf( this.get[ type ]() );

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
