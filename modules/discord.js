var db = require('../db'),
		config = require('../config'),
		helpers = require('../helpers');

module.exports = function(client) {
	client.on('ready', function() {
		console.log('[DISCORD]   Ready');
	});

	client.on('message', function(message) {
		db.settings.get().then(function(data) {
			var params = message.content.split(" ");

			if (data.logs === true) {
				if (message.channel.guild && message.guild.id == config.discord.bot.server) {
					db.logs.add({
						discord_id: message.author.id,
						discord_tag: message.author.tag,
						message_id: message.id,
						channel_id: message.channel.id,
						channel_name: message.channel.name,
						timestamp: message.createdTimestamp,
						message: message.content,
						edits: [],
						deleted: false
					});
				}
			}

			db.filters.getAll().then(function(filters) {
				db.users.getByDiscordId(message.author.id).then(function(user) {
					for (var filter of filters) {
						if (filter.enabled === true) {
							var pattern;
							if (filter.banphrase.substring(0, 1) == "/" && filter.banphrase.substring(filter.banphrase.length - 1, filter.banphrase.length) == "/") {
			          pattern = new RegExp(filter.banphrase.slice(1, -1));
			        }
			        else {
			          pattern = new RegExp(filter.banphrase);
			        }
							if (pattern.test(message) === true) {
								if (filter.exclusions.method == "one") {
									if (user && (filter.exclusions.mods == true && user.type == "mod") || (filter.exclusions.helpers == true && user.type == "helper") || (filter.exclusions.wiki == true && user.display.subreddit == "wiki") || (filter.exclusions.staff == true && user.display.twitch == "staff") || (filter.exclusions.admins == true && user.display.twitch == "admin") || (filter.exclusions.global_mods == true && user.display.twitch == "global_mod") || (filter.exclusions.contributors == true && user.display.subreddit == "contributor") || (filter.exclusions.twoos == true && user.balance >= filter.exclusions.twoos_value)) {
										continue;
									}
								}
								else {
									if (user && (filter.exclusions.mods == true && user.type == "mod") && (filter.exclusions.helpers == true && user.type == "helper") && (filter.exclusions.wiki == true && user.display.subreddit == "wiki") && (filter.exclusions.staff == true && user.display.twitch == "staff") && (filter.exclusions.admins == true && user.display.twitch == "admin") && (filter.exclusions.global_mods == true && user.display.twitch == "global_mod") && (filter.exclusions.contributors == true && user.display.subreddit == "contributor") && (filter.exclusions.twoos == true && user.balance >= filter.exclusions.twoos_value)) {
										continue;
									}
								}
								message.delete();
							}
						}
					}
				});
			});

			if (message.channel.recipient) {
				var guild = client.guilds.get(config.discord.bot.server),
				member = guild.members.get(message.author.id);

				if (params[0] == "!accept") {
					if (data.verify === true) {
						if (member) {
							if (member.roles.array().map(function(x) { return x.id; }).indexOf(config.discord.bot.roles["verified"]) === -1) {
								member.addRole(config.discord.bot.roles["verified"]);
								message.reply("Thank you. You are now permitted to speak in the /r/Twitch Discord server. If you wish to reject the use of message log, please DM me with the command `!reject`. Ensure you have familiarised yourself with the server rules before starting!");
							}
							else {
								message.reply("You have already accepted the /r/Twitch Discord server rules and given permission for your messages to be logged. Therefore I cannot complete this action.");
							}
						}
						else {
							message.reply("You are not in the /r/Twitch Discord server. Therefore I cannot complete this action.");
						}
					}
					else {
						message.reply("Verification is currently disabled. Therefore I cannot complete this action.");
					}
				}
				else if (params[0] == "!reject") {
					if (data.verify === true) {
						if (member) {
							if (member.roles.array().map(function(x) { return x.id; }).indexOf(config.discord.bot.roles["verified"]) > -1) {
								member.removeRole(config.discord.bot.roles["verified"]);
								message.reply("Your rejection has been accepted. However, you will now no longer be able to send messages to the /r/Twitch Discord server. If you change your mind, please DM me with the command `!accept`. Thank you for understanding.");
							}
							else {
								message.reply("You have not already accepted the /r/Twitch Discord server rules and given permission for your messages to be logged. Therefore I cannot complete this action.");
							}
						}
						else {
							message.reply("You are not in the /r/Twitch Discord server. Therefore I cannot complete this action.");
						}
					}
					else {
						message.reply("Verification is currently disabled. Therefore I cannot complete this action.");
					}
				}
			}

			db.commands.getByName(params[0]).then(function(data) {
				db.users.getByDiscordId(message.author.id).then(function(user) {
					if (data) {
						if (data.enabled == true) {
							if (data.restricted == false) {
								message.reply(data.response);
							}
							else {
								if (data.restrictions.method == "one") {
									if (user && ((data.restrictions.mods == true && user.type == "mod") || (data.restrictions.helpers == true && user.type == "helper") || (data.restrictions.wiki == true && user.display.subreddit == "wiki") || (data.restrictions.staff == true && user.display.twitch == "staff") || (data.restrictions.admins == true && user.display.twitch == "admin") || (data.restrictions.global_mods == true && user.display.twitch == "global_mod") || (data.restrictions.contributors == true && user.display.subreddit == "contributor") || (data.restrictions.twoos == true && user.balance >= data.restrictions.twoos_value))) {
										message.reply(data.response);
									}
								}
								else {
									if (user && (data.restrictions.mods == false || user.type == "mod") && (data.restrictions.helpers == false || user.type == "helper") && (data.restrictions.wiki == false || user.display.subreddit == "wiki") && (data.restrictions.staff == false || user.display.twitch == "staff") && (data.restrictions.admins == false || user.display.twitch == "admin") && (data.restrictions.global_mods == false || user.display.twitch == "global_mod") && (data.restrictions.contributors == false || user.display.subreddit == "contributor") && (data.restrictions.profiles == false || user.profile.status == "approved") && (data.restrictions.twoos == false || user.balance >= data.restrictions.twoos_value)) {
										message.reply(data.response);
									}
								}
							}
						}
					}
				});
			});

			db.users.getByDiscordId(message.author.id).then(function(data) {
				if (data) {
					if (params[0] == "!purple+") {
						if (params[1] == "logs") {
							if (params[2] == "channels") {
								if (params[3] == "delete") {
									if (params[4]) {
										if (data.type == "mod") {
											db.logs.deleteByChannelId(params[4].replace("<#", "").replace(">", "")).then(function() {
												message.reply("The channel has been removed from the logs.")
											});
										}
									}
								}
								else if (params[3] == "summary") {
									if (params[4]) {
										if (data.type == "helper" || data.type == "mod") {
											db.logs.getByChannelId(params[4].replace("<#", "").replace(">", "")).then(function(logs) {
												var length = logs.length;
												message.reply("There are " + length + " messages logged for the channel.")
											});
										}
									}
								}
							}
							else if (params[2] == "users") {
								if (params[3] == "summary") {
									if (params[4]) {
										if (data.type == "helper" || data.type == "mod") {
											db.logs.getByUserId(params[4].replace("<@", "").replace(">", "")).then(function(logs) {
												var length = logs.length;
												message.reply("There are " + length + " messages logged for the user.")
											});
										}
									}
								}
								if (params[3] == "latest") {
									if (params[4]) {
										if (data.type == "helper" || data.type == "mod") {
											db.logs.query(null, params[4].replace("<@", "").replace(">", ""), 5).then(function(logs) {
												logs = logs.reverse();
												for (var log of logs) {
													var d = new Date(log.timestamp),
													deleted;
													if (log.deleted === true) {
														deleted = "Yes";
													}
													else {
														deleted = "No";
													}
													var reply = "```Channel:  #" + log.channel_name + "\nTime:     " + d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + (d.getMinutes() <10 ? '0' : '') + d.getMinutes() + ":" + d.getSeconds() + "\nEdits:    " + log.edits.length + "\nDeleted:  " + deleted + "\n\n" + log.message + "\n\n```";
													message.reply(reply)
												}
											});
										}
									}
								}
							}
						}
						else if (params[1] == "profile") {
							if (data.type == "helper" || data.type == "mod") {
								db.users.getByDiscordId(params[2].replace("<@", "").replace(">", "")).then(function(user) {
									if (user && user.profile) {
										var d = new Date(user.profile.updated),
										date = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear(),
										characters = user.profile.status.split(""),
										status = characters[0].toUpperCase();
										characters.splice(0, 1);
										status = status + characters.join("");

										message.reply("```Link:   https://purple.plus/user/" + user.twitch_username + "\nStatus: " + status + "\nDate:   " + date + "\nVotes:  " + user.profile.votes.length + "\nTags:   " + user.profile.tags.join(", ") + "```");
									}
									else {
										message.reply("That user appears to have no profile on Purple+.");
									}
								});
							}
						}
						else if (params[1] == "twoos") {
							if (data.type == "helper" || data.type == "mod") {
								if (params[2] == "add") {
									if (params[3] && params[4]) {
										db.users.getByDiscordId(params[3].replace("<@", "").replace(">", "")).then(function(user) {
											if (user) {
												user.transactions.push({
													timestamp: Date.now(),
													title: "Awarded in Discord Server",
													type: "Discord Server",
													old: parseFloat(user.balance),
													new: parseFloat((parseFloat(user.balance) + parseFloat(params[4])).toFixed(2)),
													difference: parseFloat(params[4]),
													description: null
												});
												user.discord = true;
												user.balance = parseFloat((parseFloat(user.balance) + parseFloat(params[4])).toFixed(2));
												Promise.all([helpers.reddit.setFlair(user, null), helpers.discord.setRole(user)]).then(function(response) {
													db.users.editByTwitchId(user.twitch_id, user).then(function() {
														message.reply(data.discord_name + " now has " + user.balance + " Twoos.");
													});
												});
											}
											else {
												message.reply("That user appears to have no account on Purple+.");
											}
										});
									}
								}
								else if (params[2] == "remove") {
									if (params[3] && params[4]) {
										db.users.getByDiscordId(params[3].replace("<@", "").replace(">", "")).then(function(user) {
											if (user) {
												user.transactions.push({
													timestamp: Date.now(),
													title: "Removed in Discord Server",
													type: "Discord Server",
													old: parseFloat(user.balance),
													new: parseFloat((parseFloat(user.balance) - parseFloat(params[4])).toFixed(2)),
													difference: 0 - parseFloat(params[4]),
													description: null
												});
												user.discord = true;
												user.balance = parseFloat((parseFloat(user.balance) - parseFloat(params[4])).toFixed(2));
												Promise.all([helpers.reddit.setFlair(user, null), helpers.discord.setRole(user)]).then(function(response) {
													db.users.editByTwitchId(user.twitch_id, user).then(function() {
														message.reply(data.discord_name + " now has " + user.balance + " Twoos.");
													});
												});
											}
											else {
												message.reply("That user appears to have no account on Purple+.");
											}
										});
									}
								}
								else if (params[2] == "view") {
									if (params[3]) {
										db.users.getByDiscordId(params[3].replace("<@", "").replace(">", "")).then(function(user) {
											message.reply(data.discord_name + " has " + user.balance + " Twoos.");
										});
									}
								}
								else if (params[2] == "leaders") {
									db.users.getAllByTwoos(0, 5).then(function(data) {
										for (var user of data) {
											if (user.discord_id) {
												var reply = "```Rank:            "+ (parseInt(i) + 1) +"\nTwitch Username: " + user.twitch_name + "\nReddit Username: " + user.reddit_name + "\nDiscord Tag:     " + user.discord_name + "#" +  user.discord_tag + "\nTwoos Balance:   " + user.balance + "```";
											}
											else {
												var reply = "```Rank:            "+ (parseInt(i) + 1) +"\nTwitch Username: " + user.twitch_name + "\nReddit Username: " + user.reddit_name + "\nDiscord Tag:     \nTwoos Balance:   " + user.balance + "```";
											}
											message.reply(reply)
										}
										message.reply("\n" + stringTable.create(result))
									});
								}
							}
						}
					}
				}
			});
		});
	});

	client.on('messageDelete', function(message) {
		db.settings.get().then(function(data) {
			if (data.logs === true) {
				if (message.channel.guild && message.guild.id == config.discord.bot.server) {
					db.logs.getByMessageId(message.channel.id, message.id).then(function(data) {
						if (data) {
							data.deleted = true;
							db.logs.editByMessageId(data.channel_id, data.message_id, data);
						}
					});
				}
			}
		});
	});

	client.on('messageUpdate', function(oldMessage, newMessage) {
		db.settings.get().then(function(data) {
			if (data.logs === true) {
				if (newMessage.channel.guild && newMessage.guild.id == config.discord.bot.server) {
					db.logs.getByMessageId(newMessage.channel.id, newMessage.id).then(function(data) {
						if (data) {
							data.edits.push({
								message: oldMessage.content,
								timestamp: newMessage.editedTimestamp
							});
							data.message = newMessage.content;
							db.logs.editByMessageId(data.channel_id, data.message_id, data);
						}
					});
				}
			}
		});
	});

	client.on('guildMemberAdd', function(member) {
		if (member.guild.id == config.discord.bot.server) {
			db.settings.get().then(function(data) {
				if (data.verify === true) {
					member.createDM().then(function(channel) {
						channel.send("Welcome to the /r/Twitch Discord server!\n\nIn line with the Discord Terms of Service, we are required to verify you are happy for us to log your messages. We would also like to ensure you read the server rules before continuing.\n\nIf you have read and accept the server rules, and permit us to log your messages, reply to this message with the command `!accpet`. You will then be permitted to send messages to the server.\n\nThank you for understanding.");
					});
				}
			});
			db.users.getByDiscordId(member.id).then(function(user) {
				if (user) {
					user.transactions.push({
						timestamp: Date.now(),
						title: "Joining the Discord Server",
						type: "Other",
						old: parseFloat(user.balance),
						new: parseFloat((parseFloat(user.balance) + 1).toFixed(2)),
						difference: 1,
						description: null
					});
					user.discord = true;
					user.balance = parseFloat((parseFloat(user.balance) + 1).toFixed(2));
					Promise.all([helpers.reddit.setFlair(user, null), helpers.discord.setRole(user)]).then(function(response) {
						db.users.editByTwitchId(user.twitch_id, user);
					});
				}
			});
		}
	});

	client.on('guildMemberRemove', function(member) {
		if (member.guild.id == config.discord.bot.server) {
			db.users.getByDiscordId(member.id).then(function(user) {
				if (user && user.discord === true) {
					user.transactions.push({
						timestamp: Date.now(),
						title: "Leaving the Discord Server",
						type: "Other",
						old: parseFloat(user.balance),
						new: parseFloat((parseFloat(user.balance) - 1).toFixed(2)),
						difference: -1,
						description: null
					});
					user.discord = false;
					user.balance = parseFloat((parseFloat(user.balance) - 1).toFixed(2));
					helpers.reddit.setFlair(user, null).then(function(response) {
						db.users.editByTwitchId(user.twitch_id, user);
					});
				}
			});
		}
	});


	client.login(config.discord.bot.token);

	return client;
}
