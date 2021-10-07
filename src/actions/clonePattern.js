"use strict";

DAWCore.actions.clonePattern = ( patId, get ) => {
	const pat = get.pattern( patId ),
		type = pat.type,
		newPat = { ...pat },
		newPatId = DAWCore.actions.common.getNextIdOf( get.patterns() ),
		obj = { patterns: { [ newPatId ]: newPat } };

	newPat.name = DAWCore.actions.common.createUniqueName( "patterns", pat.name, get );
	++newPat.order;
	if ( type !== "buffer" ) {
		const newCnt = DAWCore.utils.jsonCopy( get[ type ]( pat[ type ] ) ),
			newCntId = DAWCore.actions.common.getNextIdOf( get[ type ]() );

		newPat[ type ] = newCntId;
		obj[ type ] = { [ newCntId ]: newCnt };
		obj[ DAWCore.actions.common.patternOpenedByType[ type ] ] = newPatId;
		Object.entries( get.patterns() )
			.filter( DAWCore.actions.clonePattern_filterFn[ type ].bind( null, newPat ) )
			.forEach( ( [ id, pat ] ) => obj.patterns[ id ] = { order: pat.order + 1 } );
	}
	return [
		obj,
		[ "patterns", "clonePattern", newPat.type, newPat.name, pat.name ],
	];
};

DAWCore.actions.clonePattern_filterFn = Object.freeze( {
	keys: ( newPat, [, pat ] ) => pat.type === "keys" && pat.order >= newPat.order && pat.synth === newPat.synth,
	drums: ( newPat, [, pat ] ) => pat.type === "drums" && pat.order >= newPat.order,
	slices: ( newPat, [, pat ] ) => pat.type === "slices" && pat.order >= newPat.order,
} );
