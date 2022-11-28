declare interface CSS {
  layoutWorklet: Worklet; // eslint-disable-line no-undef
  paintWorklet: Worklet; // eslint-disable-line no-undef
  animationWorklet: Worklet; // eslint-disable-line no-undef
}

declare type ChildDisplay = "block" | "normal";
declare type LayoutSizingMode = "block-like" | "manual";

declare interface LayoutOptions {
  childDisplay?: ChildDisplay;
  layoutSizingMod?: LayoutSizingMode;
}

interface CSSStyleValue {
  parse(property: string, cssText: string): CSSStyleValue;
  parseAll(property: string, cssText: string): CSSStyleValue[];
  toString(): string;
}

interface CSSStyleValueConstructor {
  new (): CSSStyleValue;
}

declare interface CSSStyleValueFactory {
  (property: string, cssText: string): CSSStyleValue;
  parse(property: string, cssText: string): CSSStyleValue;
  parseAll(property: string, cssText: string): CSSStyleValue[];
}

declare interface CSSStyleValueMap {
  [property: string]: CSSStyleValue;
}

declare interface CSSStyleValueMapConstructor {
  new (): CSSStyleValueMap;
}

declare interface CSSStyleValueMapFactory {
  (property: string, cssText: string): CSSStyleValueMap;
  parse(property: string, cssText: string): CSSStyleValueMap;
  parseAll(property: string, cssText: string): CSSStyleValueMap[];
}

declare interface CSSStyleValueMapFactoryConstructor {
  new (): CSSStyleValueMapFactory;
}

declare interface CSSStyleValueMapFactoryMap {
  [property: string]: CSSStyleValueMapFactory;
}

declare interface CSSStyleValueMapFactoryMapConstructor {
  new (): CSSStyleValueMapFactoryMap;
}

declare interface CSSStyleValueMapFactoryMapFactory {
  (property: string, cssText: string): CSSStyleValueMapFactory;
  parse(property: string, cssText: string): CSSStyleValueMapFactory;
  parseAll(property: string, cssText: string): CSSStyleValueMapFactory[];
}

declare interface CSSStyleValueMapFactoryMapFactoryConstructor {
  new (): CSSStyleValueMapFactoryMapFactory;
}

declare interface CSSStyleValueMapFactoryMapFactoryMap {
  [property: string]: CSSStyleValueMapFactoryMapFactory;
}

declare interface CSSStyleValueMapFactoryMapFactoryMapConstructor {
  new (): CSSStyleValueMapFactoryMapFactoryMap;
}

interface StylePropertyMapReadOnly {
  entries: () => IterableIterator<[string, CSSStyleValue]>;
  get(property: string): CSSStyleValue | undefined;
  getAll(property: string): CSSStyleValue[];
  has(property: string): boolean;
  readonly size: number;
  [Symbol.iterator](): [string, CSSStyleValue[]];
}

interface StylePropertyMap extends StylePropertyMapReadOnly {
  set(property: string, ...values: (CSSStyleValue | string)[]): void;
  append(property: string, ...values: (CSSStyleValue | string)[]): void;
  delete(property: string): void;
  clear(): void;
}

interface IntrinsicSizes {
  readonly minContentSize: number;
  readonly maxContentSize: number;
}

type BlockFragmentationType = "none" | "page" | "column" | "region";

interface LayoutConstraintsOptions {
  availableInlineSize: number;
  availableBlockSize: number;

  fixedInlineSize: number;
  fixedBlockSize: number;

  percentageInlineSize: number;
  percentageBlockSize: number;

  blockFragmentationOffset: number;
  blockFragmentationType?: BlockFragmentationType;

  data: any;
}

interface ChildBreakToken {
  readonly breakType: BreakType;
  readonly child: LayoutChild;
}

interface BreakToken {
  readonly childBreakTokens: readonly ChildBreakToken[];
  readonly data: any;
}

interface BreakTokenOptions {
  childBreakTokens: ChildBreakToken[];
  data: any;
}

type BreakType = "none" | "line" | "column" | "page" | "region";

interface LayoutFragment {
  readonly inlineSize: number;
  readonly blockSize: number;
  inlineOffset: number;
  blockOffset: number;
  readonly data: any;
  readonly breakToken?: ChildBreakToken;
}

interface LayoutChild {
  readonly styleMap: StylePropertyMapReadOnly;
  intrinsicSizes(): Promise<IntrinsicSizes>;
  layoutNextFragment(
    constraints: LayoutConstraintsOptions,
    breakToken: ChildBreakToken
  ): Promise<LayoutFragment>;
}

interface LayoutEdges {
  readonly inlineStart: number;
  readonly inlineEnd: number;

  readonly blockStart: number;
  readonly blockEnd: number;

  // Convenience attributes for the sum in one direction.
  readonly inline: number;
  readonly block: number;
}

declare class LayoutCtor {
  static inputProperties?: string[];
  static childrenInputProperties?: string[];
  static layoutOptions?: LayoutOptions;
  intrinsicSizes(
    children: LayoutChild[],
    edges: LayoutEdges,
    styleMap: StylePropertyMapReadOnly
  ): Promise<void>;
  layout(
    children: LayoutChild[],
    edges: LayoutEdges,
    constraints: LayoutConstraintsOptions,
    styleMap: StylePropertyMapReadOnly,
    breakToken: ChildBreakToken
  ): Promise<void>;
}

interface PaintRenderingContext2DSettings {
  alpha?: boolean;
}

interface PaintRenderingContext2D
  extends CanvasState, // eslint-disable-line no-undef
    CanvasTransform, // eslint-disable-line no-undef
    CanvasCompositing, // eslint-disable-line no-undef
    CanvasImageSmoothing, // eslint-disable-line no-undef
    CanvasFillStrokeStyles, // eslint-disable-line no-undef
    CanvasShadowStyles, // eslint-disable-line no-undef
    CanvasRect, // eslint-disable-line no-undef
    CanvasDrawPath, // eslint-disable-line no-undef
    CanvasDrawImage, // eslint-disable-line no-undef
    CanvasPathDrawingStyles, // eslint-disable-line no-undef
    CanvasPath {} // eslint-disable-line no-undef

export interface PaintSize {
  readonly width: number;
  readonly height: number;
}

export class PaintCtor {
  static inputProperties?: string[];
  static inputArguments?: string[];
  static contextOptions?: PaintRenderingContext2DSettings;
  paint(
    context: PaintRenderingContext2D,
    size: PaintSize,
    styleMap: StylePropertyMapReadOnly
  ): void;
}

interface WorkletAnimationEffect {
  getTiming(): EffectTiming; // eslint-disable-line no-undef
  getComputedTiming(): ComputedEffectTiming; // eslint-disable-line no-undef
  localTime?: number;
}

interface AnimatorInstance {
  animate(currentTime: number, effect: WorkletAnimationEffect): void;
}

interface AnimatorInstanceConstructor {
  new (options: any, state?: any): AnimatorInstance;
}

declare function registerLayout(name: string, layoutCtor: LayoutCtor): void;
declare function registerPaint(name: string, paintCtor: PaintCtor): void;
declare function registerAnimator(name: string, paintCtor: AnimatorInstanceConstructor): void;
