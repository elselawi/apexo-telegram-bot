import { CommandContext } from 'grammy';
import { BotContext } from '..';
import { Language, t } from '../messages';

class Command {
	name: string = '';
	description_en: string = '';
	description_es: string = '';
	description_ar: string = '';
	callback: (ctx: CommandContext<BotContext>) => void = () => {};

	constructor(
		name: string,
		description_en: string,
		description_es: string,
		description_ar: string,
		callback: (ctx: CommandContext<BotContext>) => void,
	) {
		this.name = name;
		this.description_en = description_en;
		this.description_es = description_es;
		this.description_ar = description_ar;
		this.callback = callback;
	}
}

const startCommand = new Command('start', 'Start', 'Comenzar', 'ابدأ', (ctx) => {
	ctx.reply(t('welcome', ctx.session.language as Language));
});

export type CommandMap = Record<string, Command>;

export { Command, startCommand };
