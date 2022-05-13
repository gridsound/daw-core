"use strict";

class DAWCoreHistory {
	static empty( daw, store ) {
		while ( store.stack.length ) {
			daw.callCallback( "historyDeleteAction", store.stack.pop() );
		}
		store.stackInd = 0;
	}
	static stackChange( daw, store, redo, msg ) {
		const stack = store.stack;
		const undo = DAWCore.utils.composeUndo( daw.$getCmp(), redo );
		const act = { redo, undo };
		const desc = DAWCoreHistory.#nameAction( act, msg );

		act.desc = desc.t;
		act.icon = desc.i;
		while ( stack.length > store.stackInd ) {
			daw.callCallback( "historyDeleteAction", stack.pop() );
		}
		++store.stackInd;
		act.index = stack.push( act );
		DAWCoreHistory.#change( daw, Object.freeze( act ), "redo", "historyAddAction" );
	}
	static getCurrentAction( store ) {
		return store.stack[ store.stackInd - 1 ] || null;
	}
	static undo( daw, store ) {
		return store.stackInd > 0
			? DAWCoreHistory.#change( daw, store.stack[ --store.stackInd ], "undo", "historyUndo" )
			: false;
	}
	static redo( daw, store ) {
		return store.stackInd < store.stack.length
			? DAWCoreHistory.#change( daw, store.stack[ store.stackInd++ ], "redo", "historyRedo" )
			: false;
	}

	// .........................................................................
	static #change( daw, act, undoredo, cbStr ) {
		const obj = act[ undoredo ];
		const prevObj = undoredo === "undo" ? act.redo : act.undo;

		daw.callCallback( cbStr, act );
		daw.compositionChange( obj, prevObj );
		return obj;
	}
	static #nameAction( act, msg ) {
		const [ part, actionName, ...args ] = msg || [];
		const fn = DAWCoreHistoryTexts.getFn( part, actionName );
		const [ i, t ] = fn ? fn( ...args ) : [ "close", "undefined" ];

		if ( !fn ) {
			console.error( `DAWCore: description 404 for "${ part }.${ actionName }"` );
		}
		return { i, t };
	}
}
