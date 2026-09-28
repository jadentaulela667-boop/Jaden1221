import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { r as TIMEFRAMES, t as INSTRUMENT_IDS } from "./types-Ce201dlI.mjs";
import { t as INSTRUMENTS } from "./symbols-DKiY0gus.mjs";
import { i as object, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/functions-Do3kEQNI.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function last(items) {
	return items[items.length - 1];
}
function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}
function trueRange(curr, prev) {
	return Math.max(curr.high - curr.low, Math.abs(curr.high - prev.close), Math.abs(curr.low - prev.close));
}
function atr(candles, period = 14) {
	if (candles.length < 2) return 0;
	const trs = [];
	for (let i = 1; i < candles.length; i++) trs.push(trueRange(candles[i], candles[i - 1]));
	const slice = trs.slice(-period);
	if (!slice.length) return 0;
	return slice.reduce((sum, value) => sum + value, 0) / slice.length;
}
function ratio(a, b) {
	if (!b) return 0;
	return a / b;
}
function near(value, target, tolerance = .08) {
	return Math.abs(value - target) <= tolerance;
}
function inBand(value, min, max, pad = .05) {
	return value >= min - pad && value <= max + pad;
}
function closeness(value, target) {
	if (!target) return 0;
	return 1 - Math.min(1, Math.abs(value - target) / Math.max(.12, target * .35));
}
function bandScore(value, min, max) {
	if (value >= min && value <= max) return 1;
	const span = Math.max(.04, max - min);
	return clamp(1 - (value < min ? min - value : value - max) / span, 0, 1);
}
function ratiosOf(x, a, b, c, d) {
	const xa = Math.abs(a.price - x.price);
	const ab = Math.abs(b.price - a.price);
	const bc = Math.abs(c.price - b.price);
	const cd = Math.abs(d.price - c.price);
	const ad = Math.abs(d.price - a.price);
	const xc = Math.abs(c.price - x.price);
	return {
		abxa: ratio(ab, xa),
		bcab: ratio(bc, ab),
		cdbc: ratio(cd, bc),
		adxa: ratio(ad, xa),
		dcxc: ratio(Math.abs(d.price - c.price), xc) || ratio(cd, xc)
	};
}
function matchPattern(r) {
	const candidates = [];
	if (near(r.abxa, .618, .09) && inBand(r.bcab, .382, .886) && near(r.adxa, .786, .1)) candidates.push({
		kind: "Gartley",
		score: .42 * closeness(r.abxa, .618) + .2 * bandScore(r.bcab, .382, .886) + .38 * closeness(r.adxa, .786)
	});
	if (inBand(r.abxa, .382, .5, .07) && inBand(r.bcab, .382, .886) && near(r.adxa, .886, .1)) candidates.push({
		kind: "Bat",
		score: .3 * bandScore(r.abxa, .382, .5) + .2 * bandScore(r.bcab, .382, .886) + .5 * closeness(r.adxa, .886)
	});
	if (near(r.abxa, .786, .1) && inBand(r.adxa, 1.27, 1.618, .08)) candidates.push({
		kind: "Butterfly",
		score: .35 * closeness(r.abxa, .786) + .25 * bandScore(r.bcab, .382, .886) + .4 * bandScore(r.adxa, 1.27, 1.618)
	});
	if (inBand(r.abxa, .382, .618) && near(r.adxa, 1.618, .12) && inBand(r.cdbc, 2, 3.618, .2)) candidates.push({
		kind: "Crab",
		score: .25 * bandScore(r.abxa, .382, .618) + .45 * closeness(r.adxa, 1.618) + .3 * bandScore(r.cdbc, 2.24, 3.618)
	});
	if (inBand(r.abxa, .382, .618) && inBand(r.bcab, 1.13, 1.414, .12) && near(r.dcxc, .786, .1)) candidates.push({
		kind: "Cypher",
		score: .25 * bandScore(r.abxa, .382, .618) + .35 * bandScore(r.bcab, 1.13, 1.414) + .4 * closeness(r.dcxc, .786)
	});
	if (inBand(r.abxa, .382, .618) && inBand(r.bcab, 1.13, 1.618, .12) && inBand(r.dcxc, .886, 1.13, .1)) candidates.push({
		kind: "Shark",
		score: .3 * bandScore(r.abxa, .382, .618) + .3 * bandScore(r.bcab, 1.13, 1.618) + .4 * bandScore(r.dcxc, .886, 1.13)
	});
	if (!candidates.length) return null;
	return candidates.sort((a, b) => b.score - a.score)[0] ?? null;
}
function structureValid(x, a, b, c, d) {
	if (x.kind === d.kind && x.kind !== a.kind && a.kind === c.kind && b.kind === d.kind) return true;
	return false;
}
function detectHarmonics(candles, swings, instrumentId, timeframe, atrValue) {
	if (swings.length < 5 || candles.length < 30) return [];
	const lastIndex = candles.length - 1;
	const lastCandle = candles[lastIndex];
	const found = [];
	const start = Math.max(0, swings.length - 16);
	for (let i = start; i <= swings.length - 5; i++) {
		const x = swings[i];
		const a = swings[i + 1];
		const b = swings[i + 2];
		const c = swings[i + 3];
		const d = swings[i + 4];
		if (!structureValid(x, a, b, c, d)) continue;
		const r = ratiosOf(x, a, b, c, d);
		const matched = matchPattern(r);
		if (!matched || matched.score < .58) continue;
		const bullish = d.kind === "low";
		const side = bullish ? "buy" : "sell";
		const barsSinceD = lastIndex - d.index;
		if (barsSinceD > 28) continue;
		const entry = d.price;
		const beyondX = bullish ? Math.min(x.price, d.price) : Math.max(x.price, d.price);
		const buffer = Math.max(atrValue * .28, Math.abs(a.price - x.price) * .08);
		const stop = bullish ? beyondX - buffer : beyondX + buffer;
		const cd = Math.abs(d.price - c.price);
		const t1 = bullish ? entry + cd * .382 : entry - cd * .382;
		const t2 = bullish ? entry + cd * .618 : entry - cd * .618;
		const t3 = a.price;
		const risk = Math.abs(entry - stop);
		if (risk <= 0) continue;
		const rr = Math.abs(t1 - entry) / risk;
		if (rr < 1.15) continue;
		const price = lastCandle.close;
		const nearEntry = Math.abs(price - entry) <= atrValue * 1.15;
		const stillValid = bullish ? price >= stop && price <= c.price : price <= stop && price >= c.price;
		const status = barsSinceD <= 8 && nearEntry && stillValid ? "active" : barsSinceD <= 18 && stillValid ? "watch" : "expired";
		if (status === "expired") continue;
		const points = [
			{
				label: "X",
				time: x.time,
				price: x.price,
				index: x.index
			},
			{
				label: "A",
				time: a.time,
				price: a.price,
				index: a.index
			},
			{
				label: "B",
				time: b.time,
				price: b.price,
				index: b.index
			},
			{
				label: "C",
				time: c.time,
				price: c.price,
				index: c.index
			},
			{
				label: "D",
				time: d.time,
				price: d.price,
				index: d.index
			}
		];
		const lines = [{
			id: "xad",
			role: "pattern",
			style: "solid",
			points: points.map((p) => ({
				time: p.time,
				price: p.price
			}))
		}];
		const quality = Math.round(55 + matched.score * 28 + Math.min(8, rr * 2) + (status === "active" ? 6 : 0) + (nearEntry ? 4 : 0));
		found.push({
			id: `${instrumentId}-${timeframe}-harmonic-${matched.kind}-${d.time}-${side}`,
			instrumentId,
			timeframe,
			side,
			strategy: "harmonic",
			patternName: `${bullish ? "Bullish" : "Bearish"} ${matched.kind}`,
			status,
			quality: Math.min(98, quality),
			entry,
			stop,
			targets: [
				t1,
				t2,
				t3
			],
			rr: Number(rr.toFixed(2)),
			formedAt: d.time * 1e3,
			notes: `XABCD ${matched.kind} complete at D. AB/XA ${r.abxa.toFixed(3)}, AD/XA ${r.adxa.toFixed(3)}.`,
			confluence: [
				`PRZ at D`,
				`RR ${rr.toFixed(1)} to TP1`,
				status === "active" ? "Price still in zone" : "Watching reaction"
			],
			points,
			lines,
			levels: [
				{
					price: entry,
					label: "Entry",
					kind: "entry"
				},
				{
					price: stop,
					label: "Stop",
					kind: "stop"
				},
				{
					price: t1,
					label: "TP1",
					kind: "target"
				},
				{
					price: t2,
					label: "TP2",
					kind: "target"
				},
				{
					price: t3,
					label: "TP3",
					kind: "target"
				}
			]
		});
	}
	return found.sort((a, b) => b.quality - a.quality || b.formedAt - a.formedAt).slice(0, 3);
}
function clusterLevels(prices, tolerance) {
	const sorted = [...prices].sort((a, b) => a - b);
	const clusters = [];
	for (const price of sorted) {
		const current = clusters[clusters.length - 1];
		if (current && Math.abs(price - current.sum / current.count) <= tolerance) {
			current.sum += price;
			current.count += 1;
		} else clusters.push({
			sum: price,
			count: 1
		});
	}
	return clusters.map((c) => ({
		price: c.sum / c.count,
		touches: c.count
	})).filter((c) => c.touches >= 2).sort((a, b) => b.touches - a.touches);
}
function detectLevels(candles, swings, atrValue) {
	if (!candles.length) return [];
	const lastClose = last(candles).close;
	const tolerance = Math.max(atrValue * .35, lastClose * 7e-4);
	const clustered = clusterLevels(swings.map((s) => s.price), tolerance);
	const dayMs = 86400;
	const lastTime = last(candles).time;
	const prior = candles.filter((c) => c.time < lastTime - dayMs * .4);
	const session = prior.length ? prior.slice(-48) : candles.slice(0, Math.max(8, candles.length - 8));
	let hi = -Infinity;
	let lo = Infinity;
	let close = session[session.length - 1]?.close ?? lastClose;
	for (const c of session) {
		hi = Math.max(hi, c.high);
		lo = Math.min(lo, c.low);
		close = c.close;
	}
	const pp = (hi + lo + close) / 3;
	const r1 = 2 * pp - lo;
	const s1 = 2 * pp - hi;
	const r2 = pp + (hi - lo);
	const s2 = pp - (hi - lo);
	const levels = [
		{
			price: pp,
			label: "Pivot",
			kind: "pivot"
		},
		{
			price: r1,
			label: "R1",
			kind: "resistance"
		},
		{
			price: r2,
			label: "R2",
			kind: "resistance"
		},
		{
			price: s1,
			label: "S1",
			kind: "support"
		},
		{
			price: s2,
			label: "S2",
			kind: "support"
		}
	];
	for (const cluster of clustered.slice(0, 8)) {
		const kind = cluster.price >= lastClose ? "resistance" : "support";
		levels.push({
			price: cluster.price,
			label: `${kind === "support" ? "S" : "R"} ${cluster.touches}x`,
			kind
		});
	}
	return levels;
}
function detectSrSignals(candles, swings, levels, instrumentId, timeframe, atrValue) {
	if (candles.length < 20) return [];
	const lastBar = last(candles);
	const prev = candles[candles.length - 2];
	if (!prev) return [];
	const found = [];
	const unique = levels.filter((level) => level.kind === "support" || level.kind === "resistance");
	for (const level of unique.slice(0, 10)) {
		const dist = Math.abs(lastBar.close - level.price);
		if (dist > atrValue * 1.4) continue;
		const wickLow = Math.min(lastBar.open, lastBar.close) - lastBar.low;
		const wickHigh = lastBar.high - Math.max(lastBar.open, lastBar.close);
		const body = Math.abs(lastBar.close - lastBar.open);
		const bullishPin = level.kind === "support" && lastBar.low <= level.price + atrValue * .15 && lastBar.close > level.price && wickLow > body * .9;
		const bearishPin = level.kind === "resistance" && lastBar.high >= level.price - atrValue * .15 && lastBar.close < level.price && wickHigh > body * .9;
		const bullEngulf = level.kind === "support" && lastBar.close > lastBar.open && prev.close < prev.open && lastBar.close >= prev.open && lastBar.low <= level.price + atrValue * .25;
		const bearEngulf = level.kind === "resistance" && lastBar.close < lastBar.open && prev.close > prev.open && lastBar.close <= prev.open && lastBar.high >= level.price - atrValue * .25;
		const buy = bullishPin || bullEngulf;
		if (!buy && !(bearishPin || bearEngulf)) continue;
		const side = buy ? "buy" : "sell";
		const entry = lastBar.close;
		const buffer = atrValue * .35;
		const stop = buy ? Math.min(lastBar.low, level.price) - buffer : Math.max(lastBar.high, level.price) + buffer;
		const risk = Math.abs(entry - stop);
		if (risk <= 0) continue;
		const t1 = buy ? entry + risk * 1.6 : entry - risk * 1.6;
		const t2 = buy ? entry + risk * 2.4 : entry - risk * 2.4;
		const rr = Math.abs(t1 - entry) / risk;
		const reaction = bullishPin || bearishPin ? "pin bar" : "engulfing";
		const quality = Math.round(62 + (reaction === "pin bar" ? 8 : 6) + Math.min(10, rr * 3) + (dist < atrValue * .35 ? 6 : 2));
		found.push({
			id: `${instrumentId}-${timeframe}-sr-${level.label}-${lastBar.time}-${side}`,
			instrumentId,
			timeframe,
			side,
			strategy: "sr",
			patternName: `${buy ? "Support bounce" : "Resistance rejection"}`,
			status: "active",
			quality: Math.min(94, quality),
			entry,
			stop,
			targets: [t1, t2],
			rr: Number(rr.toFixed(2)),
			formedAt: lastBar.time * 1e3,
			notes: `${reaction} at ${level.label}. Price respected the level and closed back ${buy ? "above" : "below"} it.`,
			confluence: [
				level.label,
				reaction,
				`RR ${rr.toFixed(1)}`
			],
			points: [{
				label: buy ? "S" : "R",
				time: lastBar.time,
				price: level.price,
				index: candles.length - 1
			}],
			lines: [],
			levels: [
				{
					price: level.price,
					label: level.label,
					kind: level.kind
				},
				{
					price: entry,
					label: "Entry",
					kind: "entry"
				},
				{
					price: stop,
					label: "Stop",
					kind: "stop"
				},
				{
					price: t1,
					label: "TP1",
					kind: "target"
				},
				{
					price: t2,
					label: "TP2",
					kind: "target"
				}
			]
		});
	}
	return found.sort((a, b) => b.quality - a.quality).slice(0, 2);
}
function nearestLevel(levels, price, atrValue) {
	return levels.filter((level) => level.kind === "support" || level.kind === "resistance").map((level) => ({
		level,
		dist: Math.abs(level.price - price)
	})).filter((item) => item.dist <= atrValue * .8).sort((a, b) => a.dist - b.dist)[0]?.level;
}
function moreExtreme(a, b) {
	if (a.kind !== b.kind) return b;
	if (a.kind === "high") return a.price >= b.price ? a : b;
	return a.price <= b.price ? a : b;
}
function findSwings(candles, left = 5, right = 3) {
	if (candles.length < left + right + 3) return [];
	const raw = [];
	for (let i = left; i < candles.length - right; i++) {
		const bar = candles[i];
		let isHigh = true;
		let isLow = true;
		for (let j = i - left; j <= i + right; j++) {
			if (j === i) continue;
			const other = candles[j];
			if (other.high > bar.high) isHigh = false;
			if (other.low < bar.low) isLow = false;
		}
		if (isHigh) raw.push({
			index: i,
			time: bar.time,
			price: bar.high,
			kind: "high"
		});
		else if (isLow) raw.push({
			index: i,
			time: bar.time,
			price: bar.low,
			kind: "low"
		});
	}
	const alternating = [];
	for (const swing of raw) {
		const prev = alternating[alternating.length - 1];
		if (!prev) {
			alternating.push(swing);
			continue;
		}
		if (prev.kind === swing.kind) alternating[alternating.length - 1] = moreExtreme(prev, swing);
		else alternating.push(swing);
	}
	const range = atr(candles, 14);
	const lastClose = candles[candles.length - 1]?.close ?? 0;
	const minSize = Math.max(range * .45, lastClose * 6e-4);
	const filtered = [];
	for (const swing of alternating) {
		const prev = filtered[filtered.length - 1];
		if (!prev) {
			filtered.push(swing);
			continue;
		}
		if (Math.abs(swing.price - prev.price) < minSize) {
			filtered[filtered.length - 1] = moreExtreme(prev, swing);
			continue;
		}
		filtered.push(swing);
	}
	return filtered;
}
function projectY(t1, y1, t2, y2, t) {
	if (t2 === t1) return y2;
	return y1 + (y2 - y1) / (t2 - t1) * (t - t1);
}
function trendlineIntersect(a1, a2, b1, b2) {
	const x1 = a1.time;
	const y1 = a1.price;
	const x2 = a2.time;
	const y2 = a2.price;
	const x3 = b1.time;
	const y3 = b1.price;
	const x4 = b2.time;
	const y4 = b2.price;
	const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
	if (Math.abs(den) < 1e-9) return null;
	const px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / den;
	const py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / den;
	if (px <= Math.max(x2, x4)) return null;
	return {
		time: px,
		price: py
	};
}
function detectWolfe(candles, swings, instrumentId, timeframe, atrValue) {
	if (swings.length < 5 || candles.length < 40) return [];
	const lastIndex = candles.length - 1;
	const lastCandle = candles[lastIndex];
	const found = [];
	const start = Math.max(0, swings.length - 14);
	for (let i = start; i <= swings.length - 5; i++) {
		const p = swings.slice(i, i + 5);
		const [p1, p2, p3, p4, p5] = p;
		const lows = p1.kind === "low" && p3.kind === "low" && p5.kind === "low";
		const highs = p1.kind === "high" && p3.kind === "high" && p5.kind === "high";
		if (!lows && !highs) continue;
		if (p2.kind === p1.kind || p4.kind === p2.kind) continue;
		const bullish = lows;
		const side = bullish ? "buy" : "sell";
		if (!(bullish ? p1.price > p3.price && p2.price > p4.price : p1.price < p3.price && p2.price < p4.price)) continue;
		const projected5 = projectY(p1.time, p1.price, p3.time, p3.price, p5.time);
		const overshoot = bullish ? projected5 - p5.price : p5.price - projected5;
		if (overshoot < atrValue * .05) continue;
		const apex = trendlineIntersect(p1, p3, p2, p4);
		const epaPrice = projectY(p1.time, p1.price, p4.time, p4.price, lastCandle.time + (p5.time - p1.time) * .15);
		const barsSince5 = lastIndex - p5.index;
		if (barsSince5 > 20) continue;
		const entry = p5.price;
		const buffer = Math.max(atrValue * .3, Math.abs(p4.price - p5.price) * .12);
		const stop = bullish ? entry - buffer : entry + buffer;
		const t1 = epaPrice;
		const t2 = p1.price;
		const risk = Math.abs(entry - stop);
		const reward = Math.abs(t1 - entry);
		if (risk <= 0 || reward / risk < 1.2) continue;
		if (bullish && t1 <= entry) continue;
		if (!bullish && t1 >= entry) continue;
		const price = lastCandle.close;
		const nearEntry = Math.abs(price - entry) <= atrValue * 1.2;
		const stillValid = bullish ? price >= stop : price <= stop;
		const status = barsSince5 <= 6 && nearEntry && stillValid ? "active" : barsSince5 <= 14 && stillValid ? "watch" : "expired";
		if (status === "expired") continue;
		const points = p.map((swing, idx) => ({
			label: String(idx + 1),
			time: swing.time,
			price: swing.price,
			index: swing.index
		}));
		const extendTo = Math.max(lastCandle.time, apex?.time ?? lastCandle.time);
		const lines = [
			{
				id: "wolfe-path",
				role: "pattern",
				style: "solid",
				points: points.map((pt) => ({
					time: pt.time,
					price: pt.price
				}))
			},
			{
				id: "wolfe-135",
				role: "trend",
				style: "dashed",
				points: [
					{
						time: p1.time,
						price: p1.price
					},
					{
						time: p3.time,
						price: p3.price
					},
					{
						time: extendTo,
						price: projectY(p1.time, p1.price, p3.time, p3.price, extendTo)
					}
				]
			},
			{
				id: "wolfe-24",
				role: "trend",
				style: "dashed",
				points: [
					{
						time: p2.time,
						price: p2.price
					},
					{
						time: p4.time,
						price: p4.price
					},
					{
						time: extendTo,
						price: projectY(p2.time, p2.price, p4.time, p4.price, extendTo)
					}
				]
			},
			{
				id: "wolfe-epa",
				role: "epa",
				style: "dashed",
				points: [
					{
						time: p1.time,
						price: p1.price
					},
					{
						time: p4.time,
						price: p4.price
					},
					{
						time: extendTo,
						price: projectY(p1.time, p1.price, p4.time, p4.price, extendTo)
					}
				]
			}
		];
		const symmetry = 1 - Math.min(1, Math.abs(p3.time - p1.time - (p5.time - p3.time)) / Math.max(1, p5.time - p1.time));
		const quality = Math.round(58 + clamp(overshoot / Math.max(atrValue, 1e-6), 0, 1) * 10 + symmetry * 10 + Math.min(8, reward / risk * 2) + (status === "active" ? 6 : 0));
		found.push({
			id: `${instrumentId}-${timeframe}-wolfe-${p5.time}-${side}`,
			instrumentId,
			timeframe,
			side,
			strategy: "wolfe",
			patternName: `${bullish ? "Bullish" : "Bearish"} Wolfe Wave`,
			status,
			quality: Math.min(97, quality),
			entry,
			stop,
			targets: [t1, t2],
			rr: Number((reward / risk).toFixed(2)),
			formedAt: p5.time * 1e3,
			notes: `5-wave Wolfe complete. Point 5 overshot the 1-3 line; EPA is the 1-4 projection.`,
			confluence: [
				"Point 5 entry",
				"EPA 1-4 line",
				apex ? "Channel converging" : "Channel intact"
			],
			points,
			lines,
			levels: [
				{
					price: entry,
					label: "Entry",
					kind: "entry"
				},
				{
					price: stop,
					label: "Stop",
					kind: "stop"
				},
				{
					price: t1,
					label: "EPA",
					kind: "target"
				},
				{
					price: t2,
					label: "TP2",
					kind: "target"
				}
			]
		});
	}
	return found.sort((a, b) => b.quality - a.quality || b.formedAt - a.formedAt).slice(0, 2);
}
var LEFT = {
	"15m": 5,
	"30m": 4,
	"1h": 4
};
var RIGHT = {
	"15m": 3,
	"30m": 3,
	"1h": 2
};
function analyzeChart(instrumentId, timeframe, candles, quote) {
	const atrValue = atr(candles, 14);
	const swings = findSwings(candles, LEFT[timeframe], RIGHT[timeframe]);
	const levels = detectLevels(candles, swings, atrValue);
	const harmonics = detectHarmonics(candles, swings, instrumentId, timeframe, atrValue);
	const wolfe = detectWolfe(candles, swings, instrumentId, timeframe, atrValue);
	const sr = detectSrSignals(candles, swings, levels, instrumentId, timeframe, atrValue);
	return {
		instrumentId,
		timeframe,
		candles,
		quote,
		signals: [
			...harmonics,
			...wolfe,
			...sr
		].map((signal) => {
			const magnet = nearestLevel(levels, signal.entry, atrValue);
			if (!magnet) return signal;
			const confluence = signal.confluence.includes(magnet.label) ? signal.confluence : [...signal.confluence, `${magnet.label} confluence`];
			return {
				...signal,
				quality: Math.min(99, signal.quality + 6),
				confluence
			};
		}).sort((a, b) => b.quality - a.quality),
		levels,
		atr: atrValue
	};
}
function applyMultiTimeframeConfluence(signals) {
	const byKey = /* @__PURE__ */ new Map();
	for (const signal of signals) {
		const key = `${signal.instrumentId}-${signal.side}`;
		const list = byKey.get(key) ?? [];
		list.push(signal);
		byKey.set(key, list);
	}
	return signals.map((signal) => {
		const peers = byKey.get(`${signal.instrumentId}-${signal.side}`) ?? [];
		const tfs = new Set(peers.map((item) => item.timeframe));
		if (tfs.size < 2) return signal;
		return {
			...signal,
			quality: Math.min(99, signal.quality + 5 * (tfs.size - 1)),
			confluence: [...signal.confluence, `Aligned on ${[...tfs].join(" + ")}`]
		};
	});
}
function buildScan(charts) {
	const quotes = charts.filter((chart) => chart.timeframe === "15m").map((chart) => chart.quote);
	const signals = applyMultiTimeframeConfluence(charts.flatMap((chart) => chart.signals)).sort((a, b) => {
		const statusRank = {
			active: 0,
			watch: 1,
			expired: 2
		};
		return statusRank[a.status] - statusRank[b.status] || b.quality - a.quality;
	});
	return {
		generatedAt: Date.now(),
		quotes,
		signals,
		charts
	};
}
var chartInput = object({
	instrumentId: _enum(INSTRUMENT_IDS),
	timeframe: _enum(TIMEFRAMES)
});
async function mapPool(items, limit, fn) {
	const out = new Array(items.length);
	let cursor = 0;
	async function worker() {
		while (cursor < items.length) {
			const index = cursor++;
			out[index] = await fn(items[index]);
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
	return out;
}
var getChartData_createServerFn_handler = createServerRpc({
	id: "b20b56db9cfb80a1e427b0c34f737a251739d64b4dcc656ed77af9e40257589a",
	name: "getChartData",
	filename: "src/lib/market/functions.ts"
}, (opts) => getChartData.__executeServer(opts));
var getChartData = createServerFn({ method: "POST" }).validator(chartInput).handler(getChartData_createServerFn_handler, async ({ data }) => {
	const { loadSeries } = await import("./yahoo.server-DSh_ooKK.mjs");
	const { candles, quote } = await loadSeries(data.instrumentId, data.timeframe);
	return analyzeChart(data.instrumentId, data.timeframe, candles, quote);
});
var getMarketScan_createServerFn_handler = createServerRpc({
	id: "be10d1f0f73735c3df26c59bdf88a11d2afe050dee952d176ef4e335e5e99421",
	name: "getMarketScan",
	filename: "src/lib/market/functions.ts"
}, (opts) => getMarketScan.__executeServer(opts));
var getMarketScan = createServerFn({ method: "POST" }).handler(getMarketScan_createServerFn_handler, async () => {
	const { loadSeries } = await import("./yahoo.server-DSh_ooKK.mjs");
	return buildScan(await mapPool(INSTRUMENTS.flatMap((instrument) => TIMEFRAMES.map((timeframe) => ({
		instrumentId: instrument.id,
		timeframe
	}))), 4, async (job) => {
		const { candles, quote } = await loadSeries(job.instrumentId, job.timeframe);
		return analyzeChart(job.instrumentId, job.timeframe, candles, quote);
	}));
});
//#endregion
export { getChartData_createServerFn_handler, getMarketScan_createServerFn_handler };
