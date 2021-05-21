"use strict";

DAWCore.actions.clonePattern = ( patId, get ) => {
	const pat = get.pattern( patId ),
		type = pat.type,
		newPat = { ...pat },
		newPatId = DAWCore.actions.common.getNextIdOf( get.patterns() ),
		obj = { patterns: { [ newPatId ]: newPat } };

	newPat.name = DAWCore.actions.common.createUniqueName( "patterns", pat.name, get );
	++newPat.order;
	if ( type === "keys" || type === "drums" ) {
		const newCnt = DAWCore.utils.jsonCopy( get[ type ]( pat[ type ] ) ),
			newCntId = DAWCore.actions.common.getNextIdOf( get[ type ]() );

		newPat[ type ] = newCntId;
		obj[ type ] = { [ newCntId ]: newCnt };
		obj[ type === "keys"
			? "patternKeysOpened"
			: "patternDrumsOpened" ] = newPatId;
		Object.entries( get.patterns() )
			.filter( type === "keys"
				? ( [ , pat ] ) => pat.type === type && pat.order >= newPat.order && pat.synth === newPat.synth
				: ( [ , pat ] ) => pat.type === type && pat.order >= newPat.order )
			.forEach( ( [ id, pat ] ) => obj.patterns[ id ] = { order: pat.order + 1 } );
	}
	return [
		obj,
		[ "patterns", "clonePattern", newPat.type, newPat.name, pat.name ],
	];
};
