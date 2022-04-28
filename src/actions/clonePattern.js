"use strict";

DAWCore.actions.set( "clonePattern", ( patId, get ) => {
	const pat = get.pattern( patId );
	const type = pat.type;
	const newPat = { ...pat };
	const newPatId = DAWCore.actionsCommon.getNextIdOf( get.patterns() );
	const obj = { patterns: { [ newPatId ]: newPat } };

	newPat.name = DAWCore.actionsCommon.createUniqueName( "patterns", pat.name, get );
	++newPat.order;
	if ( type !== "buffer" ) {
		const newCnt = DAWCore.utils.jsonCopy( get[ type ]( pat[ type ] ) );
		const newCntId = DAWCore.actionsCommon.getNextIdOf( get[ type ]() );

		newPat[ type ] = newCntId;
		obj[ type ] = { [ newCntId ]: newCnt };
		obj[ DAWCore.actionsCommon.patternOpenedByType[ type ] ] = newPatId;
		Object.entries( get.patterns() )
			.filter( DAWCore.actions.clonePattern_filterFn[ type ].bind( null, newPat ) )
			.forEach( ( [ id, pat ] ) => obj.patterns[ id ] = { order: pat.order + 1 } );
	}
	return [
		obj,
		[ "patterns", "clonePattern", newPat.type, newPat.name, pat.name ],
	];
} );

DAWCore.actions.clonePattern_filterFn = Object.freeze( {
	keys: ( newPat, [ , pat ] ) => pat.type === "keys" && pat.order >= newPat.order && pat.synth === newPat.synth,
	drums: ( newPat, [ , pat ] ) => pat.type === "drums" && pat.order >= newPat.order,
	slices: ( newPat, [ , pat ] ) => pat.type === "slices" && pat.order >= newPat.order,
} );
