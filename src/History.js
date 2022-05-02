"use strict";

DAWCore.History = class {
	#daw = null;
	#stack = [];
	#stackInd = 0;

	constructor( daw ) {
		this.#daw = daw;
		Object.seal( this );
	}

	// .........................................................................
	empty() {
		while ( this.#stack.length ) {
			this.#daw.callCallback( "historyDeleteAction", this.#stack.pop() );
		}
		this.#stackInd = 0;
	}
	stackChange( redo, msg ) {
		const stack = this.#stack;
		const undo = DAWCore.utils.composeUndo( this.#daw.composition.cmp, redo );
		const act = { redo, undo };
		const desc = DAWCore.History.#nameAction( act, msg );

		act.desc = desc.t;
		act.icon = desc.i;
		while ( stack.length > this.#stackInd ) {
			this.#daw.callCallback( "historyDeleteAction", stack.pop() );
		}
		++this.#stackInd;
		act.index = stack.push( act );
		this.#change( Object.freeze( act ), "redo", "historyAddAction" );
	}
	getCurrentAction() {
		return this.#stack[ this.#stackInd - 1 ] || null;
	}
	undo() {
		return this.#stackInd > 0
			? this.#change( this.#stack[ --this.#stackInd ], "undo", "historyUndo" )
			: false;
	}
	redo() {
		return this.#stackInd < this.#stack.length
			? this.#change( this.#stack[ this.#stackInd++ ], "redo", "historyRedo" )
			: false;
	}

	// .........................................................................
	#change( act, undoredo, cbStr ) {
		const obj = act[ undoredo ];
		const prevObj = undoredo === "undo" ? act.redo : act.undo;

		this.#daw.callCallback( cbStr, act );
		this.#daw.composition.change( obj, prevObj );
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
