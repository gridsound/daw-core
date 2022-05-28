"use strict";

DAWCore.actions.set( "clonePattern", ( daw, patId ) => {
	const pat = daw.$getPattern( patId );
	const type = pat.type;
	const newPat = { ...pat };
	const newPatId = DAWCore.actionsCommon.getNextIdOf( daw.$getPatterns() );
	const obj = { patterns: { [ newPatId ]: newPat } };

	newPat.name = DAWCore.actionsCommon.createUniqueName( daw.$getPatterns(), pat.name );
	++newPat.order;
	if ( type !== "buffer" ) {
		const newCnt = DAWCore.utils.jsonCopy( daw.$getItemByType( type, pat[ type ] ) );
		const newCntId = DAWCore.actionsCommon.getNextIdOf( daw.$getListByType( type ) );

		newPat[ type ] = newCntId;
		obj[ type ] = { [ newCntId ]: newCnt };
		obj[ DAWCore.actionsCommon.patternOpenedByType[ type ] ] = newPatId;
		Object.entries( daw.$getPatterns() )
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
