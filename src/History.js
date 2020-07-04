"use strict";

DAWCore.History = class {
	constructor( daw ) {
		this.daw = daw;
		this._stack = [];
		this._stackInd = 0;
		this._stackCue = -1;
	}

	empty() {
		const stack = this._stack;

		while ( stack.length ) {
			this.daw._call( "historyDeleteAction", stack.pop() );
		}
		this._stackInd = 0;
	}
	stackChange( redo, msg ) {
		const stack = this._stack,
			undo = GSUtils.composeUndo( this.daw.composition.cmp, redo ),
			act = { redo, undo },
			desc = this.nameAction( act, msg );

		act.desc = desc.t;
		act.icon = desc.i;
		while ( stack.length > this._stackInd ) {
			this.daw._call( "historyDeleteAction", stack.pop() );
		}
		++this._stackInd;
		act.index = stack.push( act );
		this._change( Object.freeze( act ), "redo", "historyAddAction" );
	}
	getCurrentAction() {
		return this._stack[ this._stackInd - 1 ] || null;
	}
	goToAction( act ) {
		let n = act.index - this._stackInd;

		     if ( n < 0 ) { while ( n++ < 0 ) { this.undo(); } }
		else if ( n > 0 ) { while ( n-- > 0 ) { this.redo(); } }
		return false;
	}
	undo() {
		return this._stackInd > 0
			? this._change( this._stack[ --this._stackInd ], "undo", "historyUndo" )
			: false;
	}
	redo() {
		return this._stackInd < this._stack.length
			? this._change( this._stack[ this._stackInd++ ], "redo", "historyRedo" )
			: false;
	}

	// private:
	_change( act, undoredo, cbStr ) {
		const obj = act[ undoredo ],
			prevObj = undoredo === "undo" ? act.redo : act.undo;

		this.daw._call( cbStr, act );
		this.daw.composition.change( obj, prevObj );
		return obj;
	}
};
