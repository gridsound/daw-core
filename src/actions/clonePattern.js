"use strict";

DAWCoreActions.set( "clonePattern", ( daw, patId ) => {
	const pat = daw.$getPattern( patId );
	const type = pat.type;
	const newPat = { ...pat };
	const newPatId = DAWCoreActionsCommon.getNextIdOf( daw.$getPatterns() );
	const obj = { patterns: { [ newPatId ]: newPat } };

	newPat.name = DAWCoreActionsCommon.createUniqueName( daw.$getPatterns(), pat.name );
	++newPat.order;
	if ( type !== "buffer" ) {
		const newCnt = DAWCoreUtils.$jsonCopy( daw.$getItemByType( type, pat[ type ] ) );
		const newCntId = DAWCoreActionsCommon.getNextIdOf( daw.$getListByType( type ) );

		newPat[ type ] = newCntId;
		obj[ type ] = { [ newCntId ]: newCnt };
		obj[ DAWCoreActionsCommon.patternOpenedByType[ type ] ] = newPatId;
		Object.entries( daw.$getPatterns() )
			.filter( DAWCoreActions.clonePattern_filterFn[ type ].bind( null, newPat ) )
			.forEach( ( [ id, pat ] ) => obj.patterns[ id ] = { order: pat.order + 1 } );
	}
	return [
		obj,
		[ "patterns", "clonePattern", newPat.type, newPat.name, pat.name ],
	];
} );

DAWCoreActions.clonePattern_filterFn = Object.freeze( {
	keys: ( newPat, [ , pat ] ) => pat.type === "keys" && pat.order >= newPat.order && pat.synth === newPat.synth,
	drums: ( newPat, [ , pat ] ) => pat.type === "drums" && pat.order >= newPat.order,
	slices: ( newPat, [ , pat ] ) => pat.type === "slices" && pat.order >= newPat.order,
} );
