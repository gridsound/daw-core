"use strict";

DAWCore.History.prototype.nameAction = function( act ) {
	const cmp = this.daw.get.composition(),
		r = act.redo,
		u = act.undo;

	if ( "bpm" in r ) { return { i: "clock", t: `BPM: ${ r.bpm }` }; }
	if ( "name" in r ) { return { i: "name", t: `Name: "${ r.name }"` }; }
	if ( "loopA" in r ) { return { i: "loop", t: `Loop: ${ r.loopA } -> ${ r.loopB }` }; }
	if ( r.beatsPerMeasure || r.stepsPerBeat ) {
		return {
			i: "clock",
			t: `Time signature: ${ cmp.beatsPerMeasure }/${ cmp.stepsPerBeat }`,
		};
	}
	return (
		DAWCore.History._nameAction_channels( cmp, r, u ) ||
		DAWCore.History._nameAction_synth( cmp, r, u ) ||
		DAWCore.History._nameAction_pattern( cmp, r, u ) ||
		DAWCore.History._nameAction_tracks( cmp, r, u ) ||
		DAWCore.History._nameAction_blocks( cmp, r, u ) ||
		DAWCore.History._nameAction_keys( cmp, r, u ) ||
		{ i: "", t: "" }
	);
};

DAWCore.History._nameAction_channels = function( cmp, r, u ) {
	if ( r.channels ) {
		const chanId = Object.keys( r.channels )[ 0 ],
			rChan = r.channels[ chanId ],
			uChan = u.channels[ chanId ],
			currChan = cmp.channels[ chanId ],
			currName = currChan && currChan.name;

		if ( !rChan || !uChan ) {
			return rChan
				? { i: "add", t: `New channel "${ rChan.name }"` }
				: { i: "remove", t: `Remove channel "${ uChan.name }"` };
		}
		if ( "toggle" in rChan ) {
			const t = rChan.toggle;

			return {
				i: t ? "unmute" : "mute",
				t: `${ t ? "Unmute" : "Mute" } "${ currName }" channel`,
			};
		}
		if ( "name" in rChan ) { return { i: "name", t: `${ uChan.name }: rename to "${ rChan.name }"` }; }
		if ( "pan" in rChan ) { return { i: "param", t: `${ currName }: pan "${ rChan.pan }"` }; }
		if ( "gain" in rChan ) { return { i: "param", t: `${ currName }: gain "${ rChan.gain }"` }; }
		if ( "dest" in rChan ) { return { i: "redirect", t: `${ currName } redirects to "${ cmp.channels[ rChan.dest ].name }"` }; }
	}
};

DAWCore.History._nameAction_synth = function( cmp, r, u ) {
	if ( r.synths ) {
		const synthId = Object.keys( r.synths )[ 0 ],
			syn = cmp.synths[ synthId ],
			rSyn = r.synths[ synthId ],
			uSyn = u.synths[ synthId ];

		if ( !rSyn || !uSyn ) {
			return rSyn
				? { i: "add", t: `New synthesizer "${ rSyn.name }"` }
				: { i: "remove", t: `Remove synthesizer "${ uSyn.name }"` };
		}
		if ( "name" in rSyn ) {
			return { i: "name", t: `${ uSyn.name }: rename to "${ rSyn.name }"` };
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
					? { i: "add",    t: `${ syn.name }: New oscillator` }
					: { i: "remove", t: `${ syn.name }: Remove oscillator` };
			}
			return { i: "param", t: `${ syn.name }: set ${ param[ 0 ] } to "${ param[ 1 ] }"` };
		}
	}
};

DAWCore.History._nameAction_blocks = function( cmp, r, u ) {
	const rBlcs = r.blocks;

	for ( const id in rBlcs ) {
		const arrK = Object.keys( rBlcs ),
			rBlc = rBlcs[ id ],
			msg = `${ arrK.length } block${ arrK.length > 1 ? "s" : "" }`;

		if ( !rBlc )                             { return { i: "erase", t: `Remove ${ msg }` }; }
		if ( !u.blocks[ id ] )                   { return { i: "paint", t: `Add ${ msg }` }; }
		if ( "duration" in rBlc )                { return { i: "crop",  t: `Crop ${ msg }` }; }
		if ( "when" in rBlc || "track" in rBlc ) { return { i: "move",  t: `Move ${ msg }` }; }
		if ( "selected" in rBlc ) {
			return rBlc.selected
				? { i: "selection ico--plus",  t: `Select ${ msg }` }
				: { i: "selection ico--minus", t: `Unselect ${ msg }` };
		}
	}
};

DAWCore.History._nameAction_tracks = function( cmp, r, u ) {
	const o = r.tracks;

	if ( o ) {
		let a, i = 0;

		for ( a in o ) {
			if ( o[ a ].name ) {
				return { i: "name", t: `Name track: "${ u.tracks[ a ].name }" -> "${ o[ a ].name }"` };
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
				? { i: "add", t: `New pattern "${ rpat.name }"` }
				: { i: "remove", t: `Remove pattern "${ upat.name }"` };
		}
		if ( rpat.synth ) {
			return { i: "param", t: `${ pat.name }: change its synthesizer` };
		}
		if ( "name" in rpat ) {
			return { i: "name", t: `${ upat.name }: rename to "${ rpat.name }"` };
		}
	}
};

DAWCore.History._nameAction_keys = function( cmp, r, u ) {
	for ( const a in r.keys ) {
		const o = r.keys[ a ];

		for ( const b in o ) {
			const arrK = Object.keys( o ),
				msgPat = cmp.patterns[ cmp.patternOpened ].name,
				msgSmp = `${ arrK.length } key${ arrK.length > 1 ? "s" : "" }`,
				oB = o[ b ];

			return (
				( !oB                             && { i: "erase", t: `${ msgPat }: remove ${       msgSmp }` } ) ||
				( !u.keys[ a ][ b ]               && { i: "paint", t: `${ msgPat }: add ${          msgSmp }` } ) ||
				( "duration" in oB                && { i: "crop",  t: `${ msgPat }: crop ${         msgSmp }` } ) ||
				( "gain" in oB                    && { i: "param", t: `${ msgPat }: edit gain of ${ msgSmp }` } ) ||
				( "pan" in oB                     && { i: "param", t: `${ msgPat }: edit pan of ${  msgSmp }` } ) ||
				( ( "when" in oB || "key" in oB ) && { i: "move",  t: `${ msgPat }: move ${         msgSmp }` } ) ||
				( "selected" in oB && ( oB.selected
					? { i: "selection ico--plus",  t: `${ msgPat }: select ${ msgSmp }` }
					: { i: "selection ico--minus", t: `${ msgPat }: unselect ${ msgSmp }` }
				) )
			);
		}
	}
};
