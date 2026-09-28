import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, d as Slot, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as STRATEGIES, r as TIMEFRAMES, t as INSTRUMENT_IDS } from "./types-Ce201dlI.mjs";
import { i as formatPrice, n as INSTRUMENT_MAP, r as TIMEFRAME_META, t as INSTRUMENTS } from "./symbols-DKiY0gus.mjs";
import { i as object, t as _enum } from "../_libs/zod.mjs";
import { a as LayoutGrid, c as ArrowUpRight, i as ListFilter, l as ArrowDownRight, o as ChartCandlestick, r as Radio, s as Bell, t as X } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useDeskStore } from "./router-8mhVjPgf.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as h, i as Qe, n as K, o as le, r as Nr, s as ye, t as $i } from "../_libs/lightweight-charts.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
import { t as formatDistanceToNow } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-41THgeDf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var chartInput = object({
	instrumentId: _enum(INSTRUMENT_IDS),
	timeframe: _enum(TIMEFRAMES)
});
var getChartData = createServerFn({ method: "POST" }).validator(chartInput).handler(createSsrRpc("b20b56db9cfb80a1e427b0c34f737a251739d64b4dcc656ed77af9e40257589a"));
var getMarketScan = createServerFn({ method: "POST" }).handler(createSsrRpc("be10d1f0f73735c3df26c59bdf88a11d2afe050dee952d176ef4e335e5e99421"));
function useChartData(instrumentId, timeframe) {
	return useQuery({
		queryKey: [
			"chart",
			instrumentId,
			timeframe
		],
		queryFn: () => getChartData({ data: {
			instrumentId,
			timeframe
		} }),
		refetchInterval: 3e4
	});
}
function useMarketScan() {
	return useQuery({
		queryKey: ["scan"],
		queryFn: () => getMarketScan(),
		refetchInterval: 9e4,
		staleTime: 2e4
	});
}
function playPing() {
	if (typeof window === "undefined") return;
	const AudioCtx = window.AudioContext || window.webkitAudioContext;
	if (!AudioCtx) return;
	const ctx = new AudioCtx();
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = "triangle";
	osc.frequency.value = 740;
	gain.gain.setValueAtTime(1e-4, ctx.currentTime);
	gain.gain.exponentialRampToValueAtTime(.05, ctx.currentTime + .02);
	gain.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + .28);
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.start();
	osc.stop(ctx.currentTime + .3);
	ctx.resume();
}
async function requestNotifyPermission() {
	if (typeof Notification === "undefined") return false;
	if (Notification.permission === "granted") return true;
	if (Notification.permission === "denied") return false;
	return await Notification.requestPermission() === "granted";
}
function pushDesktopAlert(signal) {
	if (typeof Notification === "undefined") return;
	if (Notification.permission !== "granted") return;
	const meta = INSTRUMENT_MAP[signal.instrumentId];
	const title = `${signal.side === "buy" ? "BUY" : "SELL"} ${meta.label} · ${signal.patternName}`;
	const body = `${signal.timeframe}  ·  entry ${formatPrice(signal.instrumentId, signal.entry)}  ·  quality ${signal.quality}`;
	try {
		new Notification(title, {
			body,
			silent: true
		});
	} catch {}
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			outline: "border border-border bg-transparent hover:bg-muted",
			ghost: "hover:bg-muted text-foreground",
			buy: "bg-buy text-buy-foreground hover:opacity-90",
			sell: "bg-sell text-sell-foreground hover:opacity-90"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 rounded-sm px-3 text-xs",
			lg: "h-11 px-5",
			icon: "size-10",
			chip: "h-9 px-3 text-xs tracking-wide"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var chartColors = {
	background: "#09090b",
	text: "#9a9aa3",
	grid: "rgba(232, 234, 238, 0.06)",
	border: "rgba(232, 234, 238, 0.1)",
	up: "#3f8f74",
	down: "#c45c5c",
	crosshair: "rgba(184, 197, 214, 0.45)",
	volumeUp: "rgba(63, 143, 116, 0.35)",
	volumeDown: "rgba(196, 92, 92, 0.35)",
	harmonic: "#c5d0de",
	wolfe: "#8ea0b5",
	epa: "#b8c5d6",
	entry: "#e8eaee",
	stop: "#c45c5c",
	target: "#3f8f74",
	support: "rgba(63, 143, 116, 0.85)",
	resistance: "rgba(196, 92, 92, 0.85)",
	pivot: "rgba(184, 197, 214, 0.7)"
};
function levelColor(kind) {
	if (kind === "support" || kind === "target") return chartColors.support;
	if (kind === "resistance" || kind === "stop") return chartColors.resistance;
	if (kind === "entry") return chartColors.entry;
	return chartColors.pivot;
}
function AnalysisChart({ chart, signal }) {
	const hostRef = (0, import_react.useRef)(null);
	const api = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = hostRef.current;
		if (!el) return;
		const instance = le(el, {
			autoSize: true,
			layout: {
				background: {
					type: $i.Solid,
					color: chartColors.background
				},
				textColor: chartColors.text,
				fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif",
				fontSize: 11,
				attributionLogo: false
			},
			grid: {
				vertLines: { color: chartColors.grid },
				horzLines: { color: chartColors.grid }
			},
			crosshair: {
				mode: K.Normal,
				vertLine: {
					color: chartColors.crosshair,
					width: 1,
					style: h.SparseDotted
				},
				horzLine: {
					color: chartColors.crosshair,
					width: 1,
					style: h.SparseDotted
				}
			},
			rightPriceScale: {
				borderColor: chartColors.border,
				scaleMargins: {
					top: .08,
					bottom: .12
				}
			},
			timeScale: {
				borderColor: chartColors.border,
				timeVisible: true,
				secondsVisible: false
			},
			handleScroll: {
				mouseWheel: true,
				pressedMouseMove: true,
				horzTouchDrag: true
			},
			handleScale: {
				axisPressedMouseMove: true,
				pinch: true,
				mouseWheel: true
			}
		});
		const candles = instance.addSeries(Qe, {
			upColor: chartColors.up,
			downColor: chartColors.down,
			wickUpColor: chartColors.up,
			wickDownColor: chartColors.down,
			borderVisible: false
		});
		api.current = {
			chart: instance,
			candles,
			lines: [],
			priceLines: [],
			markers: Nr(candles, [])
		};
		return () => {
			instance.remove();
			api.current = null;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const current = api.current;
		if (!current) return;
		current.candles.setData(chart.candles.map((c) => ({
			time: c.time,
			open: c.open,
			high: c.high,
			low: c.low,
			close: c.close
		})));
		for (const line of current.lines) current.chart.removeSeries(line);
		for (const priceLine of current.priceLines) current.candles.removePriceLine(priceLine);
		current.lines = [];
		current.priceLines = [];
		const overlay = signal;
		for (const src of overlay?.lines ?? []) {
			const series = current.chart.addSeries(ye, {
				color: src.role === "epa" ? chartColors.epa : src.role === "trend" ? chartColors.wolfe : overlay?.strategy === "wolfe" ? chartColors.wolfe : chartColors.harmonic,
				lineWidth: src.role === "pattern" ? 2 : 1,
				lineStyle: src.style === "dashed" ? h.Dashed : h.Solid,
				lastValueVisible: false,
				priceLineVisible: false,
				crosshairMarkerVisible: false
			});
			const points = src.points.map((point) => ({
				time: Math.round(point.time),
				value: point.price
			})).filter((point, i, arr) => i === 0 || point.time > arr[i - 1].time);
			if (points.length >= 2) series.setData(points);
			current.lines.push(series);
		}
		const levels = overlay?.levels?.length ? overlay.levels : chart.levels.slice(0, 6);
		for (const level of levels) current.priceLines.push(current.candles.createPriceLine({
			price: level.price,
			color: levelColor(level.kind),
			lineWidth: level.kind === "entry" ? 2 : 1,
			lineStyle: level.kind === "entry" || level.kind === "stop" || level.kind === "target" ? h.Dashed : h.SparseDotted,
			axisLabelVisible: true,
			title: level.label
		}));
		const markers = [];
		if (overlay) {
			for (const point of overlay.points) markers.push({
				time: point.time,
				position: overlay.side === "buy" ? "belowBar" : "aboveBar",
				color: chartColors.harmonic,
				shape: "circle",
				text: point.label
			});
			const lastPoint = overlay.points[overlay.points.length - 1];
			markers.push({
				time: lastPoint?.time ?? chart.candles[chart.candles.length - 1]?.time ?? 0,
				position: overlay.side === "buy" ? "belowBar" : "aboveBar",
				color: overlay.side === "buy" ? chartColors.up : chartColors.down,
				shape: overlay.side === "buy" ? "arrowUp" : "arrowDown",
				text: "ENTRY"
			});
		}
		current.markers.setMarkers(markers);
		current.chart.timeScale().fitContent();
	}, [chart, signal]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: hostRef,
		className: "h-full w-full"
	});
}
function InstrumentBar({ quotes }) {
	const instrumentId = useDeskStore((s) => s.instrumentId);
	const setInstrument = useDeskStore((s) => s.setInstrument);
	const quoteMap = new Map(quotes.map((q) => [q.instrumentId, q]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-2 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-4",
		children: INSTRUMENTS.map((item) => {
			const quote = quoteMap.get(item.id);
			const active = instrumentId === item.id;
			const up = (quote?.changePct ?? 0) >= 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setInstrument(item.id),
				className: cn("min-w-[132px] shrink-0 rounded-lg border px-3 py-2.5 text-left transition-[border-color,background-color] duration-150", active ? "border-accent/50 bg-muted" : "border-border bg-card hover:border-accent/30"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium tracking-wide",
						children: item.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("font-mono text-[11px] tabular-nums", up ? "text-buy" : "text-sell"),
						children: quote ? `${up ? "+" : ""}${quote.changePct.toFixed(2)}%` : "—"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-sm tabular-nums",
					children: quote ? formatPrice(item.id, quote.price) : "Scanning"
				})]
			}, item.id);
		})
	});
}
function ScannerGrid({ signals }) {
	const setInstrument = useDeskStore((s) => s.setInstrument);
	const setTimeframe = useDeskStore((s) => s.setTimeframe);
	const setSelectedSignalId = useDeskStore((s) => s.setSelectedSignalId);
	const setMobilePane = useDeskStore((s) => s.setMobilePane);
	const setChartMode = useDeskStore((s) => s.setChartMode);
	const best = /* @__PURE__ */ new Map();
	for (const signal of signals) {
		const key = `${signal.instrumentId}-${signal.timeframe}`;
		const prev = best.get(key);
		if (!prev || signal.quality > prev.quality) best.set(key, signal);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto px-3 pb-4 md:px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[520px] border-separate border-spacing-y-1 text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-2 py-2 font-medium",
					children: "Market"
				}), TIMEFRAMES.map((tf) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-2 py-2 font-medium",
					children: TIMEFRAME_META[tf].label
				}, tf))]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: INSTRUMENTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "rounded-l-md bg-card px-3 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: item.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: item.name
				})]
			}), TIMEFRAMES.map((tf) => {
				const signal = best.get(`${item.id}-${tf}`);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "bg-card px-2 py-2 last:rounded-r-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						signal,
						onOpen: () => {
							if (!signal) {
								setInstrument(item.id);
								setTimeframe(tf);
								setMobilePane("chart");
								return;
							}
							setInstrument(signal.instrumentId);
							setTimeframe(signal.timeframe);
							setSelectedSignalId(signal.id);
							setChartMode("analysis");
							setMobilePane("chart");
						}
					})
				}, tf);
			})] }, item.id)) })]
		})
	});
}
function Cell({ signal, onOpen }) {
	if (!signal) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: onOpen,
		className: "flex h-12 w-full items-center justify-center rounded-md text-xs text-muted-foreground hover:bg-muted",
		children: "Quiet"
	});
	const buy = signal.side === "buy";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onOpen,
		className: cn("flex h-12 w-full flex-col items-start justify-center rounded-md px-2 text-left", buy ? "bg-buy/10" : "bg-sell/10"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cn("text-xs font-medium", buy ? "text-buy" : "text-sell"),
			children: [
				buy ? "BUY" : "SELL",
				" ",
				signal.quality
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate text-[11px] text-muted-foreground",
			children: signal.patternName
		})]
	});
}
function pickSignal(signals, instrumentId, timeframe, selectedId) {
	if (selectedId) {
		const selected = signals.find((s) => s.id === selectedId);
		if (selected) return selected;
	}
	return signals.find((s) => s.instrumentId === instrumentId && s.timeframe === timeframe && s.status === "active") ?? signals.find((s) => s.instrumentId === instrumentId && s.timeframe === timeframe) ?? null;
}
function Sheet({ open, onOpenChange, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-background/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: cn("fixed z-50 flex flex-col border border-border bg-card text-card-foreground shadow-none", "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-xl p-5", "landscape:inset-y-0 landscape:right-0 landscape:left-auto landscape:h-full landscape:max-h-none landscape:w-[min(380px,86vw)] landscape:rounded-none landscape:rounded-l-xl", "md:inset-y-0 md:right-0 md:left-auto md:h-full md:max-h-none md:w-[380px] md:rounded-none md:rounded-l-xl md:p-6"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "sr-only",
					children: "Alert preferences, strategy filters, and market selection."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-base font-medium tracking-tight",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
						className: "inline-flex size-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Close"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 overflow-y-auto",
					children
				})
			]
		})] })
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border bg-muted transition-colors duration-150 data-[state=checked]:bg-primary", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-foreground shadow-none transition-transform duration-150 data-[state=checked]:translate-x-[22px] data-[state=checked]:bg-primary-foreground" })
	});
}
var STRATEGY_LABEL = {
	harmonic: "Harmonic patterns",
	wolfe: "Wolfe waves",
	sr: "Support & resistance"
};
function SettingsPanel() {
	const open = useDeskStore((s) => s.settingsOpen);
	const setOpen = useDeskStore((s) => s.setSettingsOpen);
	const notifyEnabled = useDeskStore((s) => s.notifyEnabled);
	const setNotifyEnabled = useDeskStore((s) => s.setNotifyEnabled);
	const soundEnabled = useDeskStore((s) => s.soundEnabled);
	const setSoundEnabled = useDeskStore((s) => s.setSoundEnabled);
	const minQuality = useDeskStore((s) => s.minQuality);
	const setMinQuality = useDeskStore((s) => s.setMinQuality);
	const enabledStrategies = useDeskStore((s) => s.enabledStrategies);
	const toggleStrategy = useDeskStore((s) => s.toggleStrategy);
	const enabledTimeframes = useDeskStore((s) => s.enabledTimeframes);
	const toggleTimeframe = useDeskStore((s) => s.toggleTimeframe);
	const enabledInstruments = useDeskStore((s) => s.enabledInstruments);
	const toggleInstrument = useDeskStore((s) => s.toggleInstrument);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange: setOpen,
		title: "Alerts & filters",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground",
							children: "Notifications"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Push alerts",
							hint: "Ping when a high-quality setup appears",
							checked: notifyEnabled,
							onCheckedChange: async (value) => {
								if (value) {
									const ok = await requestNotifyPermission();
									setNotifyEnabled(ok);
									return;
								}
								setNotifyEnabled(false);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Sound",
							hint: "Short tone with each new alert",
							checked: soundEnabled,
							onCheckedChange: setSoundEnabled
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Minimum quality" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono tabular-nums text-muted-foreground",
									children: minQuality
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 60,
								max: 92,
								value: minQuality,
								onChange: (e) => setMinQuality(Number(e.target.value)),
								className: "w-full accent-accent"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground",
						children: "Strategies"
					}), STRATEGIES.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: STRATEGY_LABEL[id],
						checked: enabledStrategies[id],
						onCheckedChange: () => toggleStrategy(id)
					}, id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground",
						children: "Timeframes"
					}), TIMEFRAMES.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: id,
						checked: enabledTimeframes[id],
						onCheckedChange: () => toggleTimeframe(id)
					}, id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground",
						children: "Markets"
					}), INSTRUMENTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: `${item.label} · ${item.name}`,
						checked: enabledInstruments[item.id],
						onCheckedChange: () => toggleInstrument(item.id)
					}, item.id))]
				})
			]
		})
	});
}
function Row({ label, hint, checked, onCheckedChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex min-h-11 items-center justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-sm",
			children: label
		}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-xs text-muted-foreground",
			children: hint
		}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked,
			onCheckedChange
		})]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-secondary text-muted-foreground",
		buy: "bg-buy/15 text-buy",
		sell: "bg-sell/15 text-sell",
		outline: "border border-border text-muted-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function SignalCard({ signal, active, onSelect }) {
	const buy = signal.side === "buy";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onSelect,
		className: cn("w-full rounded-lg border bg-card p-3 text-left transition-[border-color,background-color] duration-150", active ? "border-accent/50 bg-muted" : "border-border hover:border-accent/30"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium tracking-tight",
							children: signal.instrumentId
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-muted-foreground",
							children: signal.timeframe
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 truncate text-sm text-muted-foreground",
						children: signal.patternName
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: buy ? "buy" : "sell",
					children: [buy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "mr-1 size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "mr-1 size-3" }), buy ? "BUY" : "SELL"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid grid-cols-3 gap-2 font-mono text-xs tabular-nums",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Entry",
						value: formatPrice(signal.instrumentId, signal.entry)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Stop",
						value: formatPrice(signal.instrumentId, signal.stop)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "TP1",
						value: formatPrice(signal.instrumentId, signal.targets[0] ?? signal.entry)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 w-24 overflow-hidden rounded-full bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("h-full rounded-full", buy ? "bg-buy" : "bg-sell"),
						style: { width: `${Math.min(100, signal.quality)}%` }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-[11px] tabular-nums text-muted-foreground",
					children: [
						"Q",
						signal.quality,
						" · ",
						signal.rr.toFixed(1),
						"R · ",
						signal.status,
						" ·",
						" ",
						formatDistanceToNow(signal.formedAt, { addSuffix: true })
					]
				})]
			})
		]
	});
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-0.5 text-foreground",
		children: value
	})] });
}
var scriptPromise = null;
function loadTvScript() {
	if (typeof window === "undefined") return Promise.resolve();
	if (window.TradingView) return Promise.resolve();
	if (scriptPromise) return scriptPromise;
	scriptPromise = new Promise((resolve, reject) => {
		const existing = document.querySelector("script[data-tv]");
		if (existing) {
			existing.addEventListener("load", () => resolve());
			existing.addEventListener("error", () => reject(/* @__PURE__ */ new Error("Live chart failed to load")));
			return;
		}
		const script = document.createElement("script");
		script.src = "https://s3.tradingview.com/tv.js";
		script.async = true;
		script.dataset.tv = "true";
		script.onload = () => resolve();
		script.onerror = () => reject(/* @__PURE__ */ new Error("Live chart failed to load"));
		document.head.appendChild(script);
	});
	return scriptPromise;
}
function LiveTvChart({ symbol, interval }) {
	const hostRef = (0, import_react.useRef)(null);
	const containerId = `tv-${(0, import_react.useId)().replace(/:/g, "")}`;
	(0, import_react.useEffect)(() => {
		const el = hostRef.current;
		if (!el) return;
		el.id = containerId;
		let cancelled = false;
		let widget = null;
		(async () => {
			try {
				await loadTvScript();
				if (cancelled || !window.TradingView) return;
				el.innerHTML = "";
				widget = new window.TradingView.widget({
					autosize: true,
					symbol,
					interval,
					timezone: "Etc/UTC",
					theme: "dark",
					style: "1",
					locale: "en",
					hide_top_toolbar: false,
					hide_legend: false,
					hide_side_toolbar: true,
					allow_symbol_change: false,
					withdateranges: true,
					enable_publishing: false,
					save_image: false,
					container_id: containerId,
					backgroundColor: "#09090b",
					gridColor: "rgba(232,234,238,0.06)"
				});
			} catch {
				if (!cancelled && el) el.innerHTML = "<p class=\"flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground\">Live market chart is temporarily unavailable.</p>";
			}
		})();
		return () => {
			cancelled = true;
			try {
				widget?.remove?.();
			} catch {}
		};
	}, [
		symbol,
		interval,
		containerId
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: hostRef,
		className: "h-full min-h-[240px] w-full"
	});
}
function MeridianApp() {
	const instrumentId = useDeskStore((s) => s.instrumentId);
	const timeframe = useDeskStore((s) => s.timeframe);
	const setTimeframe = useDeskStore((s) => s.setTimeframe);
	const chartMode = useDeskStore((s) => s.chartMode);
	const setChartMode = useDeskStore((s) => s.setChartMode);
	const mobilePane = useDeskStore((s) => s.mobilePane);
	const setMobilePane = useDeskStore((s) => s.setMobilePane);
	const selectedSignalId = useDeskStore((s) => s.selectedSignalId);
	const setSelectedSignalId = useDeskStore((s) => s.setSelectedSignalId);
	const setSettingsOpen = useDeskStore((s) => s.setSettingsOpen);
	const hydrated = useDeskStore((s) => s.hydrated);
	const notifyEnabled = useDeskStore((s) => s.notifyEnabled);
	const soundEnabled = useDeskStore((s) => s.soundEnabled);
	const minQuality = useDeskStore((s) => s.minQuality);
	const enabledStrategies = useDeskStore((s) => s.enabledStrategies);
	const enabledTimeframes = useDeskStore((s) => s.enabledTimeframes);
	const enabledInstruments = useDeskStore((s) => s.enabledInstruments);
	const seenSignalIds = useDeskStore((s) => s.seenSignalIds);
	const markSeen = useDeskStore((s) => s.markSeen);
	const chartQuery = useChartData(instrumentId, timeframe);
	const scanQuery = useMarketScan();
	const quotes = scanQuery.data?.quotes ?? (chartQuery.data ? [chartQuery.data.quote] : []);
	const visibleSignals = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const signal of chartQuery.data?.signals ?? []) map.set(signal.id, signal);
		for (const signal of scanQuery.data?.signals ?? []) map.set(signal.id, signal);
		return [...map.values()];
	}, [chartQuery.data, scanQuery.data]).filter((signal) => enabledStrategies[signal.strategy] && enabledTimeframes[signal.timeframe] && enabledInstruments[signal.instrumentId]);
	const alertable = visibleSignals.filter((signal) => signal.status === "active" && signal.quality >= minQuality);
	const selected = pickSignal(visibleSignals, instrumentId, timeframe, selectedSignalId);
	const meta = INSTRUMENT_MAP[instrumentId];
	const quote = quotes.find((item) => item.instrumentId === instrumentId);
	const chartPayload = chartQuery.data ?? scanQuery.data?.charts.find((item) => item.instrumentId === instrumentId && item.timeframe === timeframe);
	const alertKey = alertable.map((s) => s.id).join("|");
	(0, import_react.useEffect)(() => {
		if (!hydrated || !alertable.length) return;
		const fresh = alertable.filter((signal) => !seenSignalIds.includes(signal.id));
		if (!fresh.length) return;
		markSeen(fresh.map((signal) => signal.id));
		const top = [...fresh].sort((a, b) => b.quality - a.quality)[0];
		toast.custom(() => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-medium",
				children: [
					top.side === "buy" ? "Buy" : "Sell",
					" ",
					INSTRUMENT_MAP[top.instrumentId].label
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-muted-foreground",
				children: [
					top.patternName,
					" · ",
					top.timeframe,
					" · Q",
					top.quality
				]
			})]
		}));
		if (notifyEnabled) pushDesktopAlert(top);
		if (soundEnabled) playPing();
	}, [
		alertKey,
		hydrated,
		notifyEnabled,
		soundEnabled,
		markSeen,
		seenSignalIds,
		alertable
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-background text-foreground lg:h-dvh lg:overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3 border-b border-border px-3 py-2.5 md:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium tracking-[0.18em] text-accent",
						children: "MERIDIAN"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-muted-foreground",
						children: "Harmonic · Wolfe · S/R · 15m / 30m / 1H"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [alertable.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden font-mono text-xs tabular-nums text-buy sm:inline",
						children: [alertable.length, " live"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden font-mono text-xs text-muted-foreground sm:inline",
						children: "Scanning"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						"aria-label": "Alerts and filters",
						onClick: () => setSettingsOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstrumentBar, { quotes }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 px-3 pb-2 md:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex rounded-md border border-border p-0.5",
					children: TIMEFRAMES.map((tf) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTimeframe(tf),
						className: cn("h-9 min-w-12 rounded-sm px-3 text-xs font-medium", timeframe === tf ? "bg-secondary text-foreground" : "text-muted-foreground"),
						children: TIMEFRAME_META[tf].label
					}, tf))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex rounded-md border border-border p-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setChartMode("analysis"),
						className: cn("h-9 rounded-sm px-3 text-xs font-medium", chartMode === "analysis" ? "bg-secondary text-foreground" : "text-muted-foreground"),
						children: "Setups"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setChartMode("live"),
						className: cn("h-9 rounded-sm px-3 text-xs font-medium", chartMode === "live" ? "bg-secondary text-foreground" : "text-muted-foreground"),
						children: "Live"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-0 landscape:max-lg:grid landscape:max-lg:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.85fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: cn("flex min-h-0 min-w-0 flex-col border-border lg:border-r landscape:max-lg:border-r", mobilePane === "chart" ? "flex" : "hidden lg:flex landscape:max-lg:flex"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end justify-between px-3 pb-2 md:px-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-lg font-medium tracking-tight md:text-xl",
								children: [meta.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-sm font-normal text-muted-foreground",
									children: meta.name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-sm tabular-nums text-muted-foreground",
								children: [quote ? formatPrice(instrumentId, quote.price) : "Waiting for feed", quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: quote.changePct >= 0 ? "ml-2 text-buy" : "ml-2 text-sell",
									children: [
										quote.changePct >= 0 ? "+" : "",
										quote.changePct.toFixed(2),
										"%"
									]
								}) : null]
							})] }), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "hidden text-right text-xs text-muted-foreground sm:block",
								children: [
									selected.patternName,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"Entry ",
									formatPrice(instrumentId, selected.entry),
									" · Stop",
									" ",
									formatPrice(instrumentId, selected.stop)
								]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative min-h-[280px] flex-1 overflow-hidden bg-background landscape:max-lg:min-h-0",
							children: chartMode === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveTvChart, {
								symbol: meta.tv,
								interval: TIMEFRAME_META[timeframe].tv
							}) : chartPayload ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalysisChart, {
								chart: chartPayload,
								signal: selected
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-full items-center justify-center text-sm text-muted-foreground",
								children: chartQuery.isError ? "Market feed paused. Retrying." : "Loading candles…"
							})
						}),
						selected && chartMode === "analysis" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 border-t border-border px-3 py-2 font-mono text-xs tabular-nums md:grid-cols-4 md:px-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Entry",
									value: formatPrice(instrumentId, selected.entry)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Stop",
									value: formatPrice(instrumentId, selected.stop),
									tone: "sell"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "TP1",
									value: formatPrice(instrumentId, selected.targets[0] ?? selected.entry),
									tone: "buy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "R:R",
									value: `${selected.rr.toFixed(1)}R`
								})
							]
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: cn("min-h-0 overflow-y-auto pb-20 lg:pb-4 landscape:max-lg:pb-3", mobilePane === "signals" || mobilePane === "scanner" ? "block" : "hidden lg:block landscape:max-lg:block"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-3 py-3 md:px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: mobilePane === "scanner" ? "Scanner" : "Setups"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[11px] text-muted-foreground",
							children: [alertable.length, " tradeable"]
						})]
					}), mobilePane === "scanner" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScannerGrid, { signals: visibleSignals }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2 px-3 pb-4 md:px-4",
						children: visibleSignals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground",
							children: scanQuery.isLoading || chartQuery.isLoading ? "Scanning harmonics, Wolfe waves, and levels…" : "No setups on the active filters. Markets are quiet or still forming."
						}) : visibleSignals.slice(0, 24).map((signal) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalCard, {
							signal,
							active: selected?.id === signal.id,
							onSelect: () => {
								useDeskStore.getState().setInstrument(signal.instrumentId);
								useDeskStore.getState().setTimeframe(signal.timeframe);
								setSelectedSignalId(signal.id);
								setChartMode("analysis");
								setMobilePane("chart");
							}
						}, signal.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hidden border-t border-border px-4 py-2 text-[11px] text-muted-foreground lg:block",
				children: "Educational analysis on public market data. Not a broker and not financial advice."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] lg:hidden landscape:max-lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBtn, {
							label: "Chart",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCandlestick, { className: "size-4" }),
							active: mobilePane === "chart",
							onClick: () => setMobilePane("chart")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBtn, {
							label: "Setups",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListFilter, { className: "size-4" }),
							active: mobilePane === "signals",
							onClick: () => setMobilePane("signals")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBtn, {
							label: "Scanner",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-4" }),
							active: mobilePane === "scanner",
							onClick: () => setMobilePane("scanner")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBtn, {
							label: "Live",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-4" }),
							active: chartMode === "live" && mobilePane === "chart",
							onClick: () => {
								setChartMode("live");
								setMobilePane("chart");
							}
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, {})
		]
	});
}
function Stat({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("mt-0.5", tone === "buy" && "text-buy", tone === "sell" && "text-sell"),
		children: value
	})] });
}
function NavBtn({ label, icon, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex h-14 flex-col items-center justify-center gap-1 text-[11px]", active ? "text-foreground" : "text-muted-foreground"),
		children: [icon, label]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeridianApp, {});
}
//#endregion
export { Home as component };
