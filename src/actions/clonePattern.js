"use strict";

DAWCore.prototype.clonePattern = function( id ) {
	const pat = this.get.pattern( id );

	pat
		? this.compositionChange( this._clonePattern( id, pat ) )
		: this._error( "clonePattern", "patterns", id );
};

DAWCore.prototype._clonePattern = function( patId, pat ) {
	const newPat = Object.assign( {}, pat ),
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
	return obj;
};
