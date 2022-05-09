"use strict";

class DAWCoreLocalStorage {
	static put( id, cmp ) {
		const cpy = DAWCore.utils.jsonCopy( cmp );

		DAWCoreCompositionFormat.out( cpy );
		localStorage.setItem( id, JSON.stringify( cpy ) );
	}
	static delete( id ) {
		localStorage.removeItem( id );
	}
	static has( id ) {
		return id in localStorage;
	}
	static get( id ) {
		try {
			const cmp = JSON.parse( localStorage.getItem( id ) );

			return id === cmp.id ? cmp : null;
		} catch ( e ) {
			return null;
		}
	}
	static getAll() {
		const cmps = Object.keys( localStorage )
			.reduce( ( arr, id ) => {
				const cmp = DAWCoreLocalStorage.get( id );

				cmp && arr.push( cmp );
				return arr;
			}, [] );

		cmps.sort( ( a, b ) => a.savedAt < b.savedAt );
		return cmps;
	}
}
