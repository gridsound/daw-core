"use strict";

DAWCoreActions.clonePattern = ( daw, patId ) => {
	const pat = daw.$getPattern( patId );
	const type = pat.type;
	const newPat = { ...pat };
	const newPatId = DAWCoreActionsCommon_getNextIdOf( daw.$getPatterns() );
	const obj = { patterns: { [ newPatId ]: newPat } };

	newPat.name = DAWCoreActionsCommon_createUniqueName( daw.$getPatterns(), pat.name );
	++newPat.order;
	const newCnt = GSUjsonCopy( daw.$getItemByType( type, pat[ type ] ) );
	const newCntId = DAWCoreActionsCommon_getNextIdOf( daw.$getListByType( type ) );

	newPat[ type ] = newCntId;
	if ( type !== "buffer" ) {
		obj[ type ] = { [ newCntId ]: newCnt };
		obj[ DAWCoreActionsCommon_patternOpenedByType[ type ] ] = newPatId;
	} else {
		obj.buffers = { [ newCntId ]: newCnt };
	}
	Object.entries( daw.$getPatterns() )
		.filter( DAWCoreActions.clonePattern_filterFn[ type ].bind( null, newPat ) )
		.forEach( ( [ id, pat ] ) => obj.patterns[ id ] = { order: pat.order + 1 } );
	return [
		obj,
		[ "patterns", "clonePattern", newPat.type, newPat.name, pat.name ],
	];
};

DAWCoreActions.clonePattern_filterFn = Object.freeze( {
	keys: ( newPat, [ , pat ] ) => pat.type === "keys" && pat.order >= newPat.order && pat.synth === newPat.synth,
	drums: ( newPat, [ , pat ] ) => pat.type === "drums" && pat.order >= newPat.order,
	slices: ( newPat, [ , pat ] ) => pat.type === "slices" && pat.order >= newPat.order,
	buffer: ( newPat, [ , pat ] ) => pat.type === "buffer" && pat.order >= newPat.order,
} );
