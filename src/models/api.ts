import { Model } from "./model";

export declare namespace Api {
	export namespace User {
		export namespace Req {
			export interface Create {
				isBuyer: boolean;
				firstName: string;
				lastName: string;
				username: string;
				email: string;
				password: string;
				phone?: string;
				prefix?: string;
				registryName?: string;
			}
		}
		
		export namespace Res {
			export interface LoggedInUser extends Model.User {
				breeder: Model.Breeder;
				favorites: any;
			}
		}
	}

	export namespace Animal {
		export namespace Req {
			export interface Create extends Model.Animal {
				breeder: Model.Breeder;
			}
		}

		export namespace Res {
			export interface AnimalListing extends Model.Animal {
				breeder: Model.Breeder;
				categories: Model.Category[];
			}
		}
	}

	export namespace Favorite {
		export namespace Req {

		}

		export namespace Res {
			export interface FavoriteListing extends Model.Favorites {
				animal: any;
			}
		}
	}

	export namespace Order {
		export namespace Req {
			export interface Create extends Model.Order {
				
			}
		}
		
		export namespace Res {
			export interface OrderListing extends Animal.Res.AnimalListing {
				animal: Model.Animal;
				isReceivedByUser: boolean;
				isDeliveredByBreeder: boolean;
				itemDescription: string;
				paymentStatus: Model.PaymentStatus;
				status: Model.OrderStatus;
				addressLine1: string;
				addressCity: string;
				addressState: string;
				addressUnitNumber: string;
				addressPostalCode: string;
				ordered_by: Model.User;
			}
		}
	}
}
