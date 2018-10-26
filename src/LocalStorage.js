"use strict";

DAWCore.LocalStorage = Object.freeze( {
	put( id, cmp ) {
		const cpy = DAWCore.objectDeepCopy( cmp );

		DAWCore.Composition.epure( cpy );
		localStorage.setItem( id, JSON.stringify( cpy ) );
	},
	delete( id ) {
		localStorage.removeItem( id );
	},
	has( id ) {
		return localStorage.hasOwnProperty( id );
	},
	get( id ) {
		try {
			const cmp = JSON.parse( localStorage.getItem( id ) );

			return id === cmp.id ? cmp : null;
		} catch ( e ) {
			return null;
		}
	},
	getAll() {
		const cmps = Object.keys( localStorage )
				.reduce( ( arr, id ) => {
					const cmp = this.get( id );

					cmp && arr.push( cmp );
					return arr;
				}, [] );

		cmps.sort( ( a, b ) => a.savedAt < b.savedAt );
		return cmps;
	},
} );
