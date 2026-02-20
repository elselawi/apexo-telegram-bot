import { CommandMap } from './commands/common';

export const supportedLanguages = ['en', 'es', 'ar'] as const;
export type Language = (typeof supportedLanguages)[number];
const escape = (str: string) => str.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function defineMessages<T extends Record<string, Record<Language, (...args: any[]) => string>>>(messages: T) {
	return messages;
}

export const messages = defineMessages({
	registerationSuccess: {
		en: ({ commandMap, name }: { commandMap: CommandMap; name: string }) =>
			`Congratulations ${name}! You have been successfully registered.\n\nYou can now use the following commands: \n` +
			Object.keys(commandMap)
				.map((x) => '/' + x + ' - ' + commandMap[x].description_en)
				.join('\n '),
		es: ({ commandMap, name }: { commandMap: CommandMap; name: string }) =>
			`¡Felicidades ${name}! Has sido registrado exitosamente.\n\nPuedes usar los siguientes comandos: \n` +
			Object.keys(commandMap)
				.map((x) => '/' + x + ' - ' + commandMap[x].description_es)
				.join('\n '),
		ar: ({ commandMap, name }: { commandMap: CommandMap; name: string }) =>
			`مبروك ${name}! لقد تم تسجيلك بنجاح.\n\nيمكنك الآن استخدام الأوامر التالية: \n` +
			Object.keys(commandMap)
				.map((x) => '/' + x + ' - ' + commandMap[x].description_ar)
				.join('\n '),
	},

	scanning: {
		en: () => 'Scanning image... 🔍',
		es: () => 'Escaneando imagen... 🔍',
		ar: () => 'جاري فحص الصورة... 🔍',
	},

	error: {
		en: (err: String) => '❌ An error occurred. Please try again later.\n\n' + err,
		es: (err: String) => '❌ Ocurrió un error. Por favor, inténtalo de nuevo más tarde.\n\n' + err,
		ar: (err: String) => '❌ حدث خطأ. يرجى المحاولة مرة أخرى لاحقاً.\n\n' + err,
	},

	commandNotFound: {
		en: ({ commandMap }: { commandMap: CommandMap }) =>
			'Please use one of the following avilable commands: \n' +
			Object.keys(commandMap)
				.map((x) => '/' + x + ' - ' + commandMap[x].description_en)
				.join('\n '),
		es: ({ commandMap }: { commandMap: CommandMap }) =>
			'Por favor, usa uno de los siguientes comandos disponibles: \n' +
			Object.keys(commandMap)
				.map((x) => '/' + x + ' - ' + commandMap[x].description_es)
				.join('\n '),
		ar: ({ commandMap }: { commandMap: CommandMap }) =>
			'يرجى استخدام أحد الأوامر المتاحة التالية: \n' +
			Object.keys(commandMap)
				.map((x) => '/' + x + ' - ' + commandMap[x].description_ar)
				.join('\n '),
	},

	welcome: {
		en: () => `Hello! Please send me a photo with a QR code to scan`,

		es: () => `¡Hola! Por favor, envíame una foto con un código QR para escanear`,

		ar: () => `مرحبا! يرجى إرسال صورة للرمز الخاص بك للمسح`,
	},

	appointments: {
		en: ({
			count,
			rows,
			name,
			currency,
		}: {
			count: number;
			rows: { date: string; price: number; paid: number }[];
			name: string;
			currency: string;
		}) =>
			`<b>📅 ${name} Appointment Summary</b>
<b>Total:</b> <code>${count} appointments</code>
━━━━━━━━━━━━━━━━━━━━
${rows
	.map(
		(row, index) => `
<b>${(index + 1).toString().padStart(2, '0')} ⮕ 📅 ${escape(row.date)}</b>
<code>Price: ${currency}${row.price.toString().padEnd(5)} | Paid: ${currency}${row.paid.toString().padEnd(5)}</code>
─────────────────────────────`,
	)
	.join('')}

Total cost: ${currency}${rows.reduce((acc, row) => acc + row.price, 0)}
Total paid: ${currency}${rows.reduce((acc, row) => acc + row.paid, 0)}
`,
		es: ({
			count,
			rows,
			name,
			currency,
		}: {
			count: number;
			rows: { date: string; price: number; paid: number }[];
			name: string;
			currency: string;
		}) =>
			`<b>📅 ${name} Resumen de Citas</b>
<b>Total:</b> <code>${count} citas</code>
━━━━━━━━━━━━━━━━━━━━
${rows
	.map(
		(row, index) => `
<b>${(index + 1).toString().padStart(2, '0')} ⮕ 📅 ${escape(row.date)}</b>
<code>Precio: ${currency}${row.price.toString().padEnd(5)} | Pagado: ${currency}${row.paid.toString().padEnd(5)}</code>
─────────────────────────────`,
	)
	.join('')}
Total precio: ${currency}${rows.reduce((acc, row) => acc + row.price, 0)}
Total pagado: ${currency}${rows.reduce((acc, row) => acc + row.paid, 0)}
`,

		ar: ({
			count,
			rows,
			name,
			currency,
		}: {
			count: number;
			rows: { date: string; price: number; paid: number }[];
			name: string;
			currency: string;
		}) =>
			`<b>📅 ملخص المواعيد ${name}</b>
<b>الإجمالي:</b> <code>${count} مواعيد</code>
━━━━━━━━━━━━━━━━━━━━
${rows
	.map(
		(row, index) => `
<b>${(index + 1).toString().padStart(2, '0')} ⮕ 📅 ${escape(row.date)}</b>
<code>السعر: ${currency}${row.price.toString().padEnd(5)} | مدفوع: ${currency}${row.paid.toString().padEnd(5)}</code>
─────────────────────────────`,
	)
	.join('')}
إجمالي السعر: ${currency}${rows.reduce((acc, row) => acc + row.price, 0)}
إجمالي المدفوع: ${currency}${rows.reduce((acc, row) => acc + row.paid, 0)}
`,
	},

	no_photos: {
		en: ({ name }: { name: string }) => 'No photos found for ' + name,
		es: ({ name }: { name: string }) => 'No se encontraron fotos por ' + name,
		ar: ({ name }: { name: string }) => 'لم يتم العثور على صور لـ ' + name,
	},

	start: {
		en: () => `Welcome to Apexo Bot! \n Please send me a photo with a QR code to scan`,
		es: () => `¡Bienvenido a Apexo Bot! \n Por favor, envíame una foto con un código QR para escanear`,
		ar: () => `مرحبا! \n يرجى إرسال صورة مع الرمز الخاص بك للمسح`,
	},

	invalidMessage: {
		en: () => `I'm sorry, I didn't understand that message.`,
		es: () => `Lo siento, no entendí ese mensaje.`,
		ar: () => `آسف، لم أفهم الرسالة.`,
	},
});

type Messages = typeof messages;
type MessageKey = keyof Messages;

export function t<K extends MessageKey, L extends Language>(key: K, language: L, ...args: Parameters<Messages[K][L]>): string {
	if (messages[key][language]) {
		return (messages[key][language] as any)(...args);
	} else {
		// send the message in all avilable languages
		const result = [];
		for (const lang of supportedLanguages) {
			result.push((messages[key][lang] as any)(...args));
		}
		return result.join('\n\n');
	}
}
