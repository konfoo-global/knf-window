import { svg, css, LitElement } from 'lit';

export class KnfWindow extends LitElement {
	static styles = css`
		:host {
			display: block;
			padding: 25px;
			color: var(--knf-window-text-color, #000);
		}
	`;

	static properties = {
		api: { type: String },
		session: { type: String },

		svg_width: { type: String },
		svg_height: { type: String },

		offset_x: { type: Number },
		offset_y: { type: Number },
		measure_bar_height: { type: Number },

		width: { type: Number },
		height: { type: Number },
		width_left: { type: Number },
		width_right: { type: Number },
		openable_left: { type: String },
		openable_right: { type: String },

		data: {attribute: false},
	};

	constructor() {
		super();
		this.api = null;
		this.session = null;

		this.svg_width = '100%';
		this.svg_height = '400';

		this.offset_x = 64;
		this.offset_y = 64;
		this.measure_bar_height = 32;

		this.width = 0;
		this.height = 0;
		this.width_left = 0;
		this.width_right = 0;
		this.openable_left = null;
		this.openable_right = null;

		this.data = {
			left_pane_size: { x: 0, y: 0 },
			right_pane_size: { x: 0, y: 0 },
		};

		this._eventListener = undefined;
	}

	connectedCallback() {
		super.connectedCallback();

		const self = this;
		this._eventListener = function onMessageWrapper(event) {
			self.onMessage(event);
		};
		window.addEventListener('konfoo-message', this._eventListener);

		this.updateGraphics();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._eventListener) {
			window.removeEventListener('konfoo-message', this._eventListener);
		}
	}

	onMessage(event) {
		if (
			typeof event.detail !== 'object' ||
			event.detail.type !== 'konfoo' ||
			typeof event.detail.cmd !== 'string'
		) {
			return;
		}

		const msg = event.detail;
		if (msg.cmd === 'change') {
			this.updateGraphics(msg.params);
		}
	}

	updateGraphics(params) {
		if (!params || !params.state) {
			return;
		}

		const root = params.state.by_id[params.state.root.__ref__];
		this.width = root.fields.width;
		this.height = root.fields.height;
		this.width_left = root.fields.width_first;
		this.width_right = root.fields.width_second;
		this.openable_left = root.fields.openable_left;
		this.openable_right = root.fields.openable_right;

		const margin = 10; // must be same as in Konfoo compute field

		this.data.left_pane_size.x = this.width_left / 10;
		this.data.left_pane_size.y = this.height / 10 - 2 * margin;

		this.data.right_pane_size.x = this.width_right / 10 - 3 * margin;
		this.data.right_pane_size.y = this.height / 10 - 2 * margin;
	}

	openLeft() {
		if (!this.openable_left)
			return svg``;

		const mode = this.openable_left.toLowerCase();

		if (mode === 'left') {
			return svg`
				<path
					style="fill:none;stroke:#000000;stroke-width:1.0;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="M ${this.data.left_pane_size.x},0 l -${this.data.left_pane_size.x},${this.data.left_pane_size.y * 0.5} L ${this.data.left_pane_size.x},${this.data.left_pane_size.y}"
					id="o-left"
				/>
			`;
		}

		if (mode === 'right') {
			return svg`
				<path
					style="fill:none;stroke:#000000;stroke-width:1.0;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="M 0,0 l ${this.data.left_pane_size.x},${this.data.left_pane_size.y * 0.5} L 0,${this.data.left_pane_size.y}"
					id="o-left"
				/>
			`;
		}

		if (mode === 'top') {
			return svg`
				<path
					style="fill:none;stroke:#000000;stroke-width:1.0;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="M 0,${this.data.left_pane_size.y} L ${this.data.left_pane_size.x * 0.5},0 L ${this.data.left_pane_size.x},${this.data.left_pane_size.y}"
					id="o-left"
				/>
			`;
		}

		return svg``;
	}

	openRight() {
		if (!this.openable_right)
			return svg``;

		const mode = this.openable_right.toLowerCase();

		if (mode === 'left') {
			return svg`
				<path
					style="fill:none;stroke:#000000;stroke-width:1.0;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="M ${this.data.right_pane_size.x},0 L 0,${this.data.right_pane_size.y * 0.5} L ${this.data.right_pane_size.x},${this.data.right_pane_size.y}"
					id="o-right"
				/>
			`;
		}

		if (mode === 'right') {
			return svg`
				<path
					style="fill:none;stroke:#000000;stroke-width:1.0;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="M 0,0 l ${this.data.right_pane_size.x},${this.data.right_pane_size.y * 0.5} L 0,${this.data.right_pane_size.y}"
					id="o-right"
				/>
			`;
		}

		if (mode === 'top') {
			return svg`
				<path
					style="fill:none;stroke:#000000;stroke-width:1.0;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
					d="M 0,${this.data.right_pane_size.y} L ${this.data.right_pane_size.x * 0.5},0 L ${this.data.right_pane_size.x},${this.data.right_pane_size.y}"
					id="o-left"
				/>
			`;
		}

		return svg``;
	}

	render() {
		return svg`
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				width="${this.svg_width}"
				height="${this.svg_height}">
				<g id="main">
					<rect
						style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:2.0;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
						id="window-outer"
						width="${this.width / 10}"
						height="${this.height / 10}"
						x="${this.offset_x}"
						y="${this.offset_y}"
					/>
					<g id="h-measure">
						<path
							style="fill:none;stroke:#000000;stroke-width:1.0;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
							d="M ${this.offset_x},${this.offset_y} V ${this.offset_y - this.measure_bar_height}"
							id="h-measure-left"
						/>
						<path
							style="fill:none;stroke:#000000;stroke-width:1.0;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
							d="M ${this.offset_x + this.width / 10},${this.offset_y} V ${this.offset_y - this.measure_bar_height}"
							id="h-measure-right"
						/>

						<path
							style="fill:none;stroke:#000000;stroke-width:1.0;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;marker-start:url(#marker1635);marker-end:url(#marker1511)"
							d="M ${this.offset_x},${this.offset_y - this.measure_bar_height * 0.5} H ${this.offset_x + this.width / 10}"
							id="h-measure-line"
						/>
						<text
							style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:10px;line-height:1.25;font-family:monospace;font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.264583"
							x="${this.offset_x + (this.width / 10) * 0.5 - 20}"
							y="${this.offset_y - this.measure_bar_height * 0.5 - 5}"
							id="h-measure-text">
							${this.width} mm
						</text>
					</g>
					<g id="v-measure">
						<path
							style="fill:none;stroke:#000000;stroke-width:1.0;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
							d="M ${this.offset_x},${this.offset_y} H ${this.offset_x - this.measure_bar_height}"
							id="v-measure-top"
						/>
						<path
							style="fill:none;stroke:#000000;stroke-width:1.0;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
							d="M ${this.offset_x},${this.offset_y + this.height / 10} H ${this.offset_x - this.measure_bar_height}"
							id="v-measure-bottom"
						/>
						<path
							style="fill:none;stroke:#000000;stroke-width:1.0;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;marker-start:url(#marker1645);marker-end:url(#marker1521)"
							d="M ${this.offset_x - this.measure_bar_height * 0.5},${this.offset_y} v ${this.height / 10}"
							id="v-measure-line"
						/>
						<g transform="translate(${this.offset_x}, ${this.offset_y}) rotate(-90)">
							<text
								style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:10px;line-height:1.25;font-family:monospace;font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.264583"
								x="-${(this.height / 10) * 0.5 + 20}"
								y="-20"
								id="v-measure-text"
							>
								${this.height} mm
							</text>
						</g>
					</g>

					<g id="window-left" transform="translate(${this.offset_x + 10}, ${this.offset_y + 10})">
						<rect
							style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:2.0;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
							width="${this.width_left / 10}"
							height="${this.height / 10 - 20}"
							x="0"
							y="0"
						/>
						${this.openLeft()}
					</g>

					<g id="window-right" transform="translate(${this.offset_x + 10 + this.width_left / 10 + 10}, ${this.offset_y + 10})">
						<rect
							style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:2.0;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
							width="${this.width_right / 10 - 10 - 10 - 10}"
							height="${this.height / 10 - 20}"
							x="0"
							y="0"
						/>
						${this.openRight()}
					</g>
				</g>
			</svg>
		`;
	}
}
