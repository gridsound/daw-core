"use strict";

DAWCore.actions.clonePattern = function( patId ) {
	const pat = this.get.pattern( patId ),
		newPat = Object.assign( {}, pat ),
		newPatId = this._getNextIdOf( this.get.patterns() ),
		obj = {
			patterns: { [ newPatId ]: newPat },
		};

	if ( pat.type === "keys" ) {
		const newKeys = GSData.deepCopy( this.get.keys( pat.keys ) ),
			newKeysId = this._getNextIdOf( this.get.keys() );

		newPat.keys = newKeysId;
		obj.keys = { [ newKeysId ]: newKeys };
		obj.patternKeysOpened = newPatId;
	}
	newPat.name = this._createUniqueName( "patterns", pat.name );
	return [
		obj,
		[ "patterns", "clonePattern", newPat.type, newPat.name, pat.name ],
	];
};
