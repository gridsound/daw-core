"use strict";

DAWCore.History.prototype.nameAction = function( act, msg ) {
	if ( msg ) {
		const [ part, actionName, ...args ] = msg,
			fn = DAWCore.History.actionsToText[ part ][ actionName ],
			[ i, t ] = fn( ...args, this.daw.get );

		return { i, t };
	}
	return this._nameAction( act );
};

DAWCore.History.actionsToText = {
	mixer: {
		addChan: chan => [ "plus", `mixer: new channel "${ chan }"`, ],
		removeChan: chan => [ "minus", `mixer: delete "${ chan }"`, ],
		reorderChan: chan => [ "sort", `mixer: reorder "${ chan }"`, ],
		renameChan: ( chan, prev ) => [ "pen", `mixer: rename "${ prev }" -> "${ chan }"` ],
		toggleChan: ( chan, b ) => [ b ? "unmute" : "mute", `mixer: ${ b ? "unmute" : "mute" } "${ chan }"`, ],
		updateChanProp: ( chan, prop, val ) => [ "mixer", `mixer: "${ chan }" ${ prop }: ${ val }`, ],
		redirectChan: ( chan, chanDest ) => [ "redirect", `mixer: redirect "${ chan }" to "${ chanDest }"`, ],
	},
	effects: {
		addFx: ( type, dest, get ) => [ "effects", `fx: new ${ type } on ${ get.channel( dest ).name }`, ],
		toggleFx: ( type, b, dest, get ) => [ b ? "unmute" : "mute", `fx: ${ b ? "unmute" : "mute" } ${ type } fx of ${ get.channel( dest ).name }`, ],
		removeFx: ( type, dest, get ) => [ "minus", `fx: remove ${ type } fx of ${ get.channel( dest ).name }`, ],
	},
};

DAWCore.History.prototype._nameAction = function( act ) {
	const cmp = this.daw.get.composition(),
		r = act.redo,
		u = act.undo;

	if ( "bpm" in r ) { return { i: "clock", t: `BPM: ${ r.bpm }` }; }
	if ( "name" in r ) { return { i: "pen", t: `Name: "${ r.name }"` }; }
	if ( "loopA" in r ) { return { i: "loop", t: `Loop: ${ r.loopA } -> ${ r.loopB }` }; }
	if ( r.beatsPerMeasure || r.stepsPerBeat ) {
		return {
			i: "clock",
			t: `Time signature: ${ cmp.beatsPerMeasure }/${ cmp.stepsPerBeat }`,
		};
	}
	return (
		DAWCore.History._nameAction_synth( cmp, r, u ) ||
		DAWCore.History._nameAction_pattern( cmp, r, u ) ||
		DAWCore.History._nameAction_tracks( cmp, r, u ) ||
		DAWCore.History._nameAction_blocks( cmp, r, u ) ||
		DAWCore.History._nameAction_keys( cmp, r, u ) ||
		{ i: "", t: "" }
	);
};

DAWCore.History._nameAction_synth = function( cmp, r, u ) {
	if ( r.synths ) {
		const synthId = Object.keys( r.synths )[ 0 ],
			syn = cmp.synths[ synthId ],
			rSyn = r.synths[ synthId ],
			uSyn = u.synths[ synthId ];

		if ( !rSyn || !uSyn ) {
			return rSyn
				? { i: "oscillator", t: `New synthesizer "${ rSyn.name }"` }
				: { i: "minus", t: `Remove synthesizer "${ uSyn.name }"` };
		}
		if ( "name" in rSyn ) {
			return { i: "pen", t: `${ uSyn.name }: rename to "${ rSyn.name }"` };
		}
		if ( "dest" in rSyn ) {
			return { i: "redirect", t: `${ syn.name }: redirects to "${ cmp.channels[ rSyn.dest ].name }"` };
		}
		if ( rSyn.oscillators ) {
			const idOsc = Object.keys( rSyn.oscillators )[ 0 ],
				rOsc = rSyn.oscillators[ idOsc ],
				uOsc = uSyn.oscillators[ idOsc ],
				param = rOsc && Object.entries( rOsc )[ 0 ];

			if ( !rOsc || !uOsc ) {
				return rOsc
					? { i: "oscillator", t: `${ syn.name }: New oscillator` }
					: { i: "minus", t: `${ syn.name }: Remove oscillator` };
			}
			return { i: "oscillator", t: `${ syn.name }: set ${ param[ 0 ] } to "${ param[ 1 ] }"` };
		}
	}
};

DAWCore.History._nameAction_blocks = function( cmp, r, u ) {
	const rBlcs = r.blocks;

	for ( const id in rBlcs ) {
		const arrK = Object.keys( rBlcs ),
			rBlc = rBlcs[ id ],
			msg = `${ arrK.length } block${ arrK.length > 1 ? "s" : "" }`;

		if ( !rBlc )                             { return { i: "erase",  t: `Remove ${ msg }` }; }
		if ( !u.blocks[ id ] )                   { return { i: "music",  t: `Add ${ msg }` }; }
		if ( "duration" in rBlc )                { return { i: "crop",   t: `Crop ${ msg }` }; }
		if ( "when" in rBlc || "track" in rBlc ) { return { i: "arrows", t: `Move ${ msg }` }; }
		if ( "selected" in rBlc ) {
			return rBlc.selected
				? { i: "mouse", t: `Select ${ msg }` }
				: { i: "mouse", t: `Unselect ${ msg }` };
		}
	}
};

DAWCore.History._nameAction_tracks = function( cmp, r, u ) {
	const o = r.tracks;

	if ( o ) {
		let a, i = 0;

		for ( a in o ) {
			if ( o[ a ].name ) {
				return { i: "pen", t: `Name track: "${ u.tracks[ a ].name }" -> "${ o[ a ].name }"` };
			}
			if ( i++ ) {
				break;
			}
		}
		return i > 1
			? { i: "unmute", t: "Un/mute several tracks" }
			: {
				i: o[ a ].toggle ? "unmute" : "mute",
				t: `${ o[ a ].toggle ? "Unmute" : "Mute" } "${ cmp.tracks[ a ].name }" track`
			};
	}
};

DAWCore.History._nameAction_pattern = function( cmp, r, u ) {
	for ( const id in r.patterns ) {
		const pat = cmp.patterns[ id ],
			rpat = r.patterns[ id ],
			upat = u.patterns[ id ];

		if ( !rpat || !upat ) {
			return rpat
				? { i: "plus", t: `New pattern "${ rpat.name }"` }
				: { i: "minus", t: `Remove pattern "${ upat.name }"` };
		}
		if ( rpat.synth ) {
			return { i: "redirect", t: `${ pat.name }: change its synthesizer` };
		}
		if ( "name" in rpat ) {
			return { i: "pen", t: `${ upat.name }: rename to "${ rpat.name }"` };
		}
	}
};

DAWCore.History._nameAction_keys = function( cmp, r, u ) {
	for ( const a in r.keys ) {
		const o = r.keys[ a ];

		for ( const b in o ) {
			const arrK = Object.keys( o ),
				msgPat = cmp.patterns[ cmp.patternKeysOpened ].name,
				msgSmp = `${ arrK.length } key${ arrK.length > 1 ? "s" : "" }`,
				oB = o[ b ];

			return (
				( !oB                             && { i: "erase",  t: `${ msgPat }: remove ${       msgSmp }` } ) ||
				( !u.keys[ a ][ b ]               && { i: "keys",   t: `${ msgPat }: add ${          msgSmp }` } ) ||
				( "duration" in oB                && { i: "crop",   t: `${ msgPat }: crop ${         msgSmp }` } ) ||
				( "gain" in oB                    && { i: "keys",   t: `${ msgPat }: edit gain of ${ msgSmp }` } ) ||
				( "pan" in oB                     && { i: "keys",   t: `${ msgPat }: edit pan of ${  msgSmp }` } ) ||
				( ( "when" in oB || "key" in oB ) && { i: "arrows", t: `${ msgPat }: move ${         msgSmp }` } ) ||
				( "selected" in oB && ( oB.selected
					? { i: "mouse", t: `${ msgPat }: select ${ msgSmp }` }
					: { i: "mouse", t: `${ msgPat }: unselect ${ msgSmp }` }
				) )
			);
		}
	}
};
