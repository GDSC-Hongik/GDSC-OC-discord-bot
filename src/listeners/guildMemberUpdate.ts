import type { Events } from "@sapphire/framework"
import { Listener } from "@sapphire/framework"
import type { GuildMember, PartialGuildMember } from "discord.js"

import { devRatingEvent } from "../lib/devRating"
import DevRatingEvent from "../types/devRatingEvent"

export class GuildMemberUpdateListener extends Listener<
	typeof Events.GuildMemberUpdate
> {
	public async run(
		oldMember: GuildMember | PartialGuildMember,
		newMember: GuildMember
	) {
		await this.handleRoleAdd(oldMember, newMember)
		await this.handleRoleRemove(oldMember, newMember)
	}

	async handleRoleAdd(
		oldMember: GuildMember | PartialGuildMember,
		newMember: GuildMember
	) {
		const oldRolesCache = oldMember.roles.cache
		const newRolesCache = newMember.roles.cache

		if (oldRolesCache.size >= newRolesCache.size) return

		// loop through the roles and check which one was added
		newRolesCache.map((role) => {
			if (oldRolesCache.has(role.id)) return
			this.container.logger.info(`role "${role.id}" added to "${oldMember.id}"`)
		})

		devRatingEvent({
			type: DevRatingEvent.UPDATE_ROLE,
			data: [newMember.id, newRolesCache],
		})
	}

	async handleRoleRemove(
		oldMember: GuildMember | PartialGuildMember,
		newMember: GuildMember
	) {
		const oldRolesCache = oldMember.roles.cache
		const newRolesCache = newMember.roles.cache

		if (oldRolesCache.size <= newRolesCache.size) return

		// loop through the roles and check which one was removed
		oldRolesCache.map((role) => {
			if (newRolesCache.has(role.id)) return
			this.container.logger.info(
				`role "${role.id}" removed from "${oldMember.id}"`
			)
		})

		devRatingEvent({
			type: DevRatingEvent.UPDATE_ROLE,
			data: [newMember.id, newRolesCache],
		})
	}
}