export interface PopupModel {
	opened: boolean;
	onCancel: () => void;
	onForceCb: () => void;
}
