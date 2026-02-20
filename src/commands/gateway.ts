import { CommandContext } from 'grammy';
import { BotContext, SessionData } from '..';
import { CommandMap } from './common';
import { unregisteredCommands } from './c-unregistered';
import { staffCommands } from './c-staff';
import { patientCommands } from './c-patients';
import { Language, t } from '../messages';

export const allCommands = [...Object.keys(unregisteredCommands), ...Object.keys(staffCommands), ...Object.keys(patientCommands)];

enum UserState {
	UNREGISTERED,
	STAFF,
	PATIENT,
}

async function commandNotFound(ctx: CommandContext<BotContext>, commands: CommandMap) {
	return ctx.reply(t('commandNotFound', ctx.session.language as Language, { commandMap: commands }));
}

function getState(session: SessionData): UserState {
	return !session.server.startsWith('http') ? UserState.UNREGISTERED : session.isStaff ? UserState.STAFF : UserState.PATIENT;
}

export function getAllowedCommands(session: SessionData): CommandMap {
	const state = getState(session);
	if (state === UserState.UNREGISTERED) {
		return unregisteredCommands;
	} else if (state === UserState.STAFF) {
		return staffCommands;
	} else {
		return patientCommands;
	}
}

export async function gateway(ctx: CommandContext<BotContext>, command: string) {
	let commands: CommandMap = getAllowedCommands(ctx.session);
	if (!commands[command]) {
		return commandNotFound(ctx, commands);
	}
	return commands[command].callback(ctx);
}
