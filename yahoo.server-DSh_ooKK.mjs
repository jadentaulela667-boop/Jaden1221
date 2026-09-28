import { n as INSTRUMENT_MAP } from "./symbols-DKiY0gus.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/yahoo.server-DSh_ooKK.js
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
var HOSTS = ["https://query1.finance.yahoo.com", "https://query2.finance.yahoo.com"];
var PLAN = {
	"15m": {
		interval: "15m",
		range: "5d"
	},
	"30m": {
		interval: "15m",
		range: "10d",
		resampleTo: 30
	},
	"1h": {
		interval: "60m",
		range: "1mo"
	}
};
var cache = /* @__PURE__ */ new Map();
var CACHE_MS = 25e3;
function resample(candles, minutes) {
	const bucket = minutes * 60;
	const groups = /* @__PURE__ */ new Map();
	for (const candle of candles) {
		const key = Math.floor(candle.time / bucket) * bucket;
		const list = groups.get(key);
		if (list) list.push(candle);
		else groups.set(key, [candle]);
	}
	return [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([time, group]) => ({
		time,
		open: group[0].open,
		high: Math.max(...group.map((c) => c.high)),
		low: Math.min(...group.map((c) => c.low)),
		close: group[group.length - 1].close,
		volume: group.reduce((sum, c) => sum + c.volume, 0)
	}));
}
async function fetchJson(url) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 12e3);
	try {
		const response = await fetch(url, {
			signal: controller.signal,
			headers: {
				"User-Agent": UA,
				Accept: "application/json,text/plain,*/*"
			}
		});
		if (!response.ok) throw new Error(`Market feed ${response.status}`);
		return await response.json();
	} finally {
		clearTimeout(timer);
	}
}
function parseChart(data, instrumentId) {
	const result = data.chart?.result?.[0];
	if (!result) throw new Error(data.chart?.error?.description ?? "No market data");
	const timestamps = result.timestamp ?? [];
	const quote = result.indicators?.quote?.[0];
	const candles = [];
	for (let i = 0; i < timestamps.length; i++) {
		const open = quote?.open?.[i];
		const high = quote?.high?.[i];
		const low = quote?.low?.[i];
		const close = quote?.close?.[i];
		if (open == null || high == null || low == null || close == null || !Number.isFinite(open) || !Number.isFinite(high) || !Number.isFinite(low) || !Number.isFinite(close)) continue;
		candles.push({
			time: timestamps[i],
			open,
			high,
			low,
			close,
			volume: quote?.volume?.[i] ?? 0
		});
	}
	if (candles.length < 20) throw new Error("Not enough bars");
	const meta = result.meta ?? {};
	const price = meta.regularMarketPrice ?? candles[candles.length - 1].close;
	const previous = meta.chartPreviousClose ?? meta.previousClose ?? candles[0].open;
	return {
		candles,
		quote: {
			instrumentId,
			price,
			previousClose: previous,
			changePct: previous ? (price - previous) / previous * 100 : 0,
			currency: meta.currency ?? "USD",
			updatedAt: (meta.regularMarketTime ?? candles[candles.length - 1].time) * 1e3
		}
	};
}
async function fetchSymbol(ticker, instrumentId, interval, range) {
	let lastError;
	for (const host of HOSTS) {
		const url = `${host}/v8/finance/chart/${encodeURIComponent(ticker)}?interval=${interval}&range=${range}&includePrePost=false`;
		try {
			return parseChart(await fetchJson(url), instrumentId);
		} catch (error) {
			lastError = error;
		}
	}
	throw lastError instanceof Error ? lastError : /* @__PURE__ */ new Error("Market feed unavailable");
}
async function loadSeries(instrumentId, timeframe) {
	const key = `${instrumentId}-${timeframe}`;
	const hit = cache.get(key);
	if (hit && hit.expires > Date.now()) return {
		candles: hit.candles,
		quote: hit.quote
	};
	const meta = INSTRUMENT_MAP[instrumentId];
	const plan = PLAN[timeframe];
	let parsed;
	try {
		parsed = await fetchSymbol(meta.yahoo, instrumentId, plan.interval, plan.range);
	} catch (error) {
		if (!meta.yahooAlt) throw error;
		parsed = await fetchSymbol(meta.yahooAlt, instrumentId, plan.interval, plan.range);
	}
	const value = {
		candles: plan.resampleTo ? resample(parsed.candles, plan.resampleTo) : parsed.candles,
		quote: parsed.quote
	};
	cache.set(key, {
		expires: Date.now() + CACHE_MS,
		...value
	});
	return value;
}
//#endregion
export { loadSeries };
