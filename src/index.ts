import { Bot, Context, session, SessionFlavor, webhookCallback } from 'grammy';
import { KvAdapter } from '@grammyjs/storage-cloudflare';
import { gateway, getAllowedCommands, allCommands } from './commands/gateway';
import { Language, t } from './messages';
import { register } from './register';

export interface SessionData {
	userId: string;
	userName: string;
	server: string;
	language: string;
	currency: string;
	isStaff: boolean;
}

export type BotContext = Context & SessionFlavor<SessionData>;

export interface Env {
	BOT_INFO: string;
	BOT_TOKEN: string;
	BOT_SESSIONS: KVNamespace;
}

let bot: Bot<BotContext> | undefined;

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (!bot) {
			bot = new Bot<BotContext>(env.BOT_TOKEN, {
				botInfo: JSON.parse(env.BOT_INFO),
			});

			bot.use(
				session({
					initial: () => ({ language: '', userId: '', userName: '', server: '', currency: '', isStaff: false }),
					storage: new KvAdapter(env.BOT_SESSIONS),
				}),
			);

			// Commands gateway
			bot.command(allCommands, async (ctx) => {
				const command = ctx.update.message?.text?.substring(1) || '';
				await gateway(ctx, command);
			});

			// Registration via QR code
			bot.on('message:photo', async (ctx) => {
				await register(ctx, env);
			});

			// other messages
			bot.on('message', async (ctx) => {
				await ctx.reply(t('invalidMessage', ctx.session.language as Language));
				await ctx.reply(t('commandNotFound', ctx.session.language as Language, { commandMap: getAllowedCommands(ctx.session) }));
			});
		}

		return webhookCallback(bot, 'cloudflare-mod')(request);
	},
};
