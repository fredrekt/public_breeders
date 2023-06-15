export interface DrawerModel {
	opened: boolean;
	onCancel: () => void;
	onForceCb: () => void;
}
