export declare namespace Model {
	export interface User {
		id: number;
		username: string;
		email: string;
		firstName: string;
		lastName: string;
		isBuyer: boolean;
		avatar: Image;
		isSubscribed: boolean;
		stripeAccountId: string;
		stripeAccountLink: string;
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
		coverPhoto: Image;
	}

	export interface Animal {
		id: number;
		name: string;
		price: number;
		bio: string;
		age: number;
		images: Image[];
		createdAt: Date;
		documents: Document[];
		stripeProductId: string;
		stripePaymentLink: string;
		stripeProductJSON: StripeProduct;
		stripePaymentLinkJSON: StripePaymentLink;
		stripePaymentLinkId: string;
		isDeleted: boolean;
	}

	export interface Favorites {
		id: number;
		animal: number;
		user: number;
	}

	export interface Category {
		id: number;
		name: string;
		icon: string;
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
		stripePaymentIntentId: string;
	}

	export type OrderStatus = 'PENDING' | 'CANCELLED' | 'IN_TRANSIT' | 'DELIVERED';

	export type PaymentStatus = 'PENDING' | 'COMPLETED';

	export type NotificationType = 'account' | 'order' | 'message';

	export interface Conversation {
		id: number;
		sender: Model.User;
		receiver: ConversationReceiver;
		messages: Message[];
		createdAt: Date | string;
		updatedAt: Date | string;
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
		id: number;
		url: string;
	}

	export interface Document {
		id: number;
		name: string;
		fileUrl: FileUrl;
	}

	export interface FileUrl {
		id: number;
		name: string;
		url: string;
	}

	export interface Notification {
		id: number;
		message: string;
		type: NotificationType;
		isRead: boolean;
		user?: Model.User;
	}

	export interface StripeProduct {
		id: string;
		object: string;
		active: boolean;
		created: number;
		default_price: string;
		description: string | null;
		images: string[];
		livemode: boolean;
		metadata: { [key: string]: string };
		name: string;
		package_dimensions: null | {
			height: number;
			length: number;
			weight: number;
			width: number;
		};
		shippable: boolean | null;
		statement_descriptor: string | null;
		tax_code: string | null;
		unit_label: string | null;
		updated: number;
		url: string | null;
	}

	export interface StripePaymentLink {
		id: string;
		object: string;
		active: boolean;
		after_completion: {
			hosted_confirmation: {
				custom_message: string | null;
			};
			type: string;
		};
		allow_promotion_codes: boolean;
		application_fee_amount: number | null;
		application_fee_percent: number | null;
		automatic_tax: {
			enabled: boolean;
		};
		billing_address_collection: 'auto' | 'required' | 'off';
		consent_collection: null | {
			text: string;
			title: string;
		};
		currency: string;
		custom_fields: {
			label: string;
			type: 'text' | 'select';
			options?: string[];
		}[];
		custom_text: {
			shipping_address: string | null;
			submit: string | null;
		};
		customer_creation: 'auto' | 'always' | 'never';
		invoice_creation: null | {
			description: string;
			statement_descriptor: string;
		};
		livemode: boolean;
		metadata: { [key: string]: string };
		on_behalf_of: string | null;
		payment_intent_data: {
			application_fee_amount?: number;
			capture_method: 'automatic' | 'manual';
			statement_descriptor: string;
		} | null;
		payment_method_collection: 'auto' | 'required';
		payment_method_types: string[] | null;
		phone_number_collection: {
			enabled: boolean;
		};
		shipping_address_collection: 'auto' | 'required' | 'off' | null;
		shipping_options: {
			id: string;
			label: string;
			amount: number;
		}[];
		submit_type: 'auto' | 'book' | 'donate' | 'pay';
		subscription_data: {
			items: {
				plan: string;
				quantity: number;
			}[];
			trial_period_days?: number;
		} | null;
		tax_id_collection: {
			enabled: boolean;
		};
		transfer_data: null | {
			destination: string;
		};
		url: string;
	}
}
