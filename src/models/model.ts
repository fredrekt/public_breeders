export declare namespace Model {
	export interface User {
		id: number;
		username: string;
		email: string;
		firstName: string;
		lastName: string;
		isBuyer: boolean;
		avatar: Image;
	}

	export interface Breeder {
		id: number;
		businessName: string;
		businessAddress: string;
		aboutBusiness: string;
		registryName: string;
		prefix: string;
		isVerified: boolean;
		avatar: Image;
	}

	export interface Animal {
		id: number;
		name: string;
		price: number;
		bio: string;
		age: number;
		images: Image[];
	}

	export interface Favorites {
		id: number;
		animal: number;
		user: number;
	}

	export interface Category {
		id: number;
		name: string;
	}

	export interface Order {
		id: number;
		isReceivedByUser: boolean;
		isDeliveredByBreeder: boolean;
		itemDescription: string;
		paymentStatus: PaymentStatus;
		status: OrderStatus;
		addressLine1: string;
		addressCity: string;
		addressState: string;
		addressUnitNumber: string;
		addressPostalCode: string;
		animal: Model.Animal;
		breeder: Model.Breeder;
	}

	export type OrderStatus = 'PENDING' | 'CANCELLED' | 'IN_TRANSIT' | 'DELIVERED'

	export type PaymentStatus = 'PENDING' | 'COMPLETED'

	export interface Conversation {
		id: number;
		sender: Model.User;
		receiver: ConversationReceiver;
		messages: Message[];
		createdAt: Date | string;
	}

	export interface ConversationReceiver extends User {
		breeder: Model.Breeder;
	}

	export interface Message {
		id: number;
		message: string;
		createdAt: Date | string;
		sender: Model.User;
	}

	export interface Image {
		url: string;
	}
}
