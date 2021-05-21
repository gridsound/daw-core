"use strict";

DAWCore.History = class {
	#daw = null
	#stack = []
	#stackInd = 0

	constructor( daw ) {
		this.#daw = daw;
		Object.seal( this );
	}

	empty() {
		while ( this.#stack.length ) {
			this.#daw._call( "historyDeleteAction", this.#stack.pop() );
		}
		this.#stackInd = 0;
	}
	stackChange( redo, msg ) {
		const stack = this.#stack,
			undo = DAWCore.utils.composeUndo( this.#daw.composition.cmp, redo ),
			act = { redo, undo },
			desc = this.nameAction( act, msg );

		act.desc = desc.t;
		act.icon = desc.i;
		while ( stack.length > this.#stackInd ) {
			this.#daw._call( "historyDeleteAction", stack.pop() );
		}
		++this.#stackInd;
		act.index = stack.push( act );
		this.#change( Object.freeze( act ), "redo", "historyAddAction" );
	}
	getCurrentAction() {
		return this.#stack[ this.#stackInd - 1 ] || null;
	}
	goToAction( act ) {
		let n = act.index - this.#stackInd;

		     if ( n < 0 ) { while ( n++ < 0 ) { this.undo(); } }
		else if ( n > 0 ) { while ( n-- > 0 ) { this.redo(); } }
		return false;
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
		const obj = act[ undoredo ],
			prevObj = undoredo === "undo" ? act.redo : act.undo;

		this.#daw._call( cbStr, act );
		this.#daw.composition.change( obj, prevObj );
		return obj;
	}
};
