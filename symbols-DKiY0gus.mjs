//#region node_modules/.nitro/vite/services/ssr/assets/symbols-DKiY0gus.js
var INSTRUMENTS = [
	{
		id: "US30",
		label: "US30",
		name: "Dow Jones",
		yahoo: "YM=F",
		yahooAlt: "^DJI",
		tv: "FOREXCOM:US30",
		decimals: 1,
		pip: 1
	},
	{
		id: "US100",
		label: "US100",
		name: "Nasdaq 100",
		yahoo: "NQ=F",
		yahooAlt: "^NDX",
		tv: "FOREXCOM:NSXUSD",
		decimals: 1,
		pip: .25
	},
	{
		id: "GBPUSD",
		label: "GBPUSD",
		name: "Cable",
		yahoo: "GBPUSD=X",
		tv: "OANDA:GBPUSD",
		decimals: 5,
		pip: 1e-4
	},
	{
		id: "GOLD",
		label: "GOLD",
		name: "XAUUSD",
		yahoo: "GC=F",
		tv: "OANDA:XAUUSD",
		decimals: 2,
		pip: .1
	},
	{
		id: "SILVER",
		label: "SILVER",
		name: "XAGUSD",
		yahoo: "SI=F",
		tv: "OANDA:XAGUSD",
		decimals: 3,
		pip: .01
	},
	{
		id: "OILCASH",
		label: "OIL",
		name: "WTI cash",
		yahoo: "CL=F",
		tv: "TVC:USOIL",
		decimals: 2,
		pip: .01
	}
];
var INSTRUMENT_MAP = Object.fromEntries(INSTRUMENTS.map((item) => [item.id, item]));
var TIMEFRAME_META = {
	"15m": {
		label: "15m",
		tv: "15",
		minutes: 15
	},
	"30m": {
		label: "30m",
		tv: "30",
		minutes: 30
	},
	"1h": {
		label: "1H",
		tv: "60",
		minutes: 60
	}
};
function formatPrice(instrumentId, value) {
	const decimals = INSTRUMENT_MAP[instrumentId].decimals;
	return value.toLocaleString("en-US", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	});
}
//#endregion
export { formatPrice as i, INSTRUMENT_MAP as n, TIMEFRAME_META as r, INSTRUMENTS as t };
