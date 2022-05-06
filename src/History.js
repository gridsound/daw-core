"use strict";

DAWCore.History = class {
	static empty( daw, obj ) {
		while ( obj.stack.length ) {
			daw.callCallback( "historyDeleteAction", obj.stack.pop() );
		}
		obj.stackInd = 0;
	}
	static stackChange( daw, obj, redo, msg ) {
		const stack = obj.stack;
		const undo = DAWCore.utils.composeUndo( daw.composition.cmp, redo );
		const act = { redo, undo };
		const desc = DAWCore.History.#nameAction( act, msg );

		act.desc = desc.t;
		act.icon = desc.i;
		while ( stack.length > obj.stackInd ) {
			daw.callCallback( "historyDeleteAction", stack.pop() );
		}
		++obj.stackInd;
		act.index = stack.push( act );
		DAWCore.History.#change( daw, Object.freeze( act ), "redo", "historyAddAction" );
	}
	static getCurrentAction( obj ) {
		return obj.stack[ obj.stackInd - 1 ] || null;
	}
	static undo( daw, obj ) {
		return obj.stackInd > 0
			? DAWCore.History.#change( daw, obj.stack[ --obj.stackInd ], "undo", "historyUndo" )
			: false;
	}
	static redo( daw, obj ) {
		return obj.stackInd < obj.stack.length
			? DAWCore.History.#change( daw, obj.stack[ obj.stackInd++ ], "redo", "historyRedo" )
			: false;
	}

	// .........................................................................
	static #change( daw, act, undoredo, cbStr ) {
		const obj = act[ undoredo ];
		const prevObj = undoredo === "undo" ? act.redo : act.undo;

		daw.callCallback( cbStr, act );
		daw.composition.change( obj, prevObj );
		return obj;
	}
	static #nameAction( act, msg ) {
		const [ part, actionName, ...args ] = msg || [];
		const fn = DAWCore.History.actionsToText[ part ]?.[ actionName ];
		const [ i, t ] = fn ? fn( ...args ) : [ "close", "undefined" ];

		if ( !fn ) {
			console.error( `DAWCore: description 404 for "${ part }.${ actionName }"` );
		}
		return { i, t };
	}
};
