import { Language, t } from '../messages';
import { PocketBaseAppointmentsRes } from '../pb_types';
import { Command, startCommand } from './common';

export const patientCommands: Record<string, Command> = {
	start: startCommand,
	appointments: new Command('appointments', 'Appointments', 'Citas', 'المواعيد', async (ctx) => {
		const url = `${ctx.session.server}/api/collections/public/records?page=1&perPage=9999&filter=pid%3D%22${ctx.session.userId}%22`;
		const response = (await (await fetch(url)).json()) as PocketBaseAppointmentsRes;
		response.items.sort((a, b) => a.date - b.date);
		ctx.reply(
			t('appointments', ctx.session.language as Language, {
				count: response.items.length,
				rows: response.items.map((x) => ({ date: new Date(x.date * 60 * 1000).toLocaleString(), price: x.price ?? 0, paid: x.paid ?? 0 })),
				name: ctx.session.userName,
				currency: ctx.session.currency,
			}),
			{
				parse_mode: 'HTML',
			},
		);
	}),
	photos: new Command('photos', 'Photos', 'Fotos', 'الصور', async (ctx) => {
		const url = `${ctx.session.server}/api/collections/public/records?page=1&perPage=9999&filter=pid%3D%22${ctx.session.userId}%22`;
		const response = (await (await fetch(url)).json()) as PocketBaseAppointmentsRes;
		let imgs: string[] = [];
		for (const item of response.items) {
			if (item.imgs && item.imgs.length > 0) {
				for (const img of item.imgs) {
					imgs.push(`${ctx.session.server}/api/files/${item.collectionId}/${item.id}/${img}`);
				}
			}
		}

		if (imgs.length == 0) {
			ctx.reply(t('no_photos', ctx.session.language as Language, { name: ctx.session.userName }));
			return;
		}

		ctx.replyWithMediaGroup(imgs.map((img) => ({ type: 'photo', media: img })));
	}),
};
