import { BotContext } from './index';
import { PocketBaseSettingsRes } from './pb_types';
import { Language, t } from './messages';
import { getAllowedCommands } from './commands/gateway';
import { decode } from './utils';

export async function register(ctx: BotContext, env: { BOT_TOKEN: string }) {
	try {
		if (!ctx.message?.photo) return;
		const photo = ctx.message.photo.pop();
		if (!photo) return;

		await ctx.reply(t('scanning', ctx.session.language as Language));

		// 1. Get the Telegram file URL
		const file = await ctx.api.getFile(photo.file_id);
		const telegramFileUrl = `https://api.telegram.org/file/bot${env.BOT_TOKEN}/${file.file_path}`;

		// 2. Fetch the image bytes from Telegram
		const imageResponse = await fetch(telegramFileUrl);
		const imageBlob = await imageResponse.blob();

		// 3. Prepare Multipart Form Data for goQR.me
		const formData = new FormData();
		formData.append('file', imageBlob, 'image.jpg');

		// 4. Post the actual file to the API
		const qrResponse = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
			method: 'POST',
			body: formData,
		});

		const result = (await qrResponse.json()) as any;

		// 5. Handle the result
		const symbol = result[0]?.symbol[0];
		const QRCodeStringContent = symbol?.data || '';
		let data = QRCodeStringContent.replace('https://patient.apexo.app/', ''); // a link to patients page
		data = data.replace('https://t.me/apexoappbot?start=S-', ''); // in case of staff member link to bot
		data = data.replace('https://t.me/apexoappbot?start=', ''); // in case of patient link directly to the bot

		await ctx.reply('QR Code String Content: ' + QRCodeStringContent);
		await ctx.reply('Data: ' + data);

		if (data.length > 0) {
			data = decode(data);
			await ctx.reply('Decoded Data: ' + data);
		}
		const [userId, name, server, lang] = data.split('|');

		// Validate QR code
		if (data == '') {
			await ctx.reply(t('error', ctx.session.language as Language, 'No QR code found in this image'));
			return;
		} else if (!userId || !name || !server || !lang) {
			await ctx.reply(t('error', ctx.session.language as Language, 'Invalid QR code format [' + data + ']'));
			return;
		} else if (lang !== 'en' && lang !== 'es' && lang !== 'ar') {
			await ctx.reply(t('error', ctx.session.language as Language, 'Invalid language code'));
			return;
		} else if (!server.startsWith('http://') && !server.startsWith('https://')) {
			await ctx.reply(t('error', ctx.session.language as Language, 'Invalid server URL'));
			return;
		} else {
			// let's request the currency from the server
			//server/api/collections/data/records?page=1&perPage=500&skipTotal=1

			const settingsReq = await fetch(`${server}/api/collections/data/records?page=1&perPage=500&skipTotal=1`);
			const settingsRes = (await settingsReq.json()) as PocketBaseSettingsRes;
			const currency: string = settingsRes.items.find((item) => item.data.id.startsWith('currency'))?.data.value || 'USD';

			// Save user data to database
			ctx.session.userId = userId;
			ctx.session.userName = name;
			ctx.session.server = server;
			ctx.session.language = lang;
			ctx.session.currency = currency;
			ctx.session.isStaff = QRCodeStringContent.startsWith('https://t.me/apexoappbot?start=S-');

			// QR code is valid
			await ctx.reply(
				t('registerationSuccess', ctx.session.language as Language, {
					commandMap: getAllowedCommands(ctx.session),
					name: ctx.session.userName,
				}),
			);
		}
	} catch (error) {
		await ctx.reply(t('error', ctx.session.language as Language, 'Failed to process the image. Please try again. Error: \n\n' + error));
	}
}
