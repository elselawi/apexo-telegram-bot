export interface PocketBaseResponse<Data> {
	items: Array<Data>;
}

export interface PocketBaseAppointment {
	collectionId: string;
	collectionName: string;
	date: number;
	id: string;
	imgs: string[];
	paid: number | null;
	pid: string;
	prescriptions: string[] | null;
	price: number | null;
}

export interface PocketBaseSetting {
	data: {
		id: string;
		value: string;
	};
}

export type PocketBaseSettingsRes = PocketBaseResponse<PocketBaseSetting>;

export type PocketBaseAppointmentsRes = PocketBaseResponse<PocketBaseAppointment>;
