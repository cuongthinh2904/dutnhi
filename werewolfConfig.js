module.exports.version = '2.5.0';
module.exports.ready = 'meplay';
module.exports.timeout = {
	DELAY_STARTGAME: 10000,
	DISCUSS: 60000,
	Bite: 30000,
	Investigator: 40000,
	Kill: 30000,
	Pair: 40000,
	Protect: 30000,
	RoleReveal: 30000,
	Seer: 30000,
	VoteLynch: 60000
};
module.exports.setups = [
	{
		name: '[🍉]→ Làng sói cổ điển 1.0',
		roles: {
			Bodyguard: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 2,
			Werewolf: 2
		}
	},
	{
		name: '[🍧]→ Ngôi làng của những bí mật',
		roles: {
			Bodyguard: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 2,
			Werewolf: 2
		}
	},
	{
		name: '[👿]→ Ngôi làng của quỷ dữ',
		roles: {
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 2,
			Werewolf: 2,
			Lycan: 1,
			Pacifist: 1
		}
	},
	{
		name: '[🧙]→ Ngôi làng của phù thủy',
		roles: {
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2,
			Lycan: 1,
			Witch: 1
		}
	},
	{
		name: '[👼]→ Ngôi làng của thần linh',
		roles: {
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2,
			Witch: 1
		}
	},
	{
		name: '[👻]→ Ngôi làng của sự chết chốc',
		roles: {
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2,
			Witch: 1
		}
	},
	{
		name: '[🤖]→ Ngôi làng bên bờ vũ trụ =)))',
		roles: {
			Cupid: 1,
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2,
			Witch: 1
		}
	},
	{
		name: '[😵]→ Làng sói thống trị',
		roles: {
			Evilseer: 1,
			Cupid: 1,
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2,
			Witch: 1
		}
	},
	{
		name: '[⚜️]→ Ngôi làng thần bí',
		roles: {
			Investigator: 1,
			Apprentice: 1,
			Evilseer: 1,
			Cupid: 1,
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2
		}
	},
	{
		name: '[🔮]→ Ngôi làng tiên tri 2.0',
		roles: {
			Tanner: 1,
			Investigator: 1,
			Apprentice: 1,
			Evilseer: 1,
			Cupid: 1,
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2
		}
	},
	{
		name: '[♨️]→ Ngôi làng của sự lưỡng lự',
		roles: {
			Tanner: 1,
			Investigator: 1,
			Apprentice: 1,
			Evilseer: 1,
			Cupid: 1,
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 4,
			Werewolf: 2
		}
	},
	{
		name: '[❌]→ Ngôi làng của những dối trá',
		roles: {
			Investigator: 1,
			Apprentice: 1,
			Evilseer: 1,
			Cupid: 1,
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 2,
			Werewolf: 2,
			Lycan: 1,
			Fruitbrute: 1,
			Oldman: 1,
			Witch: 1
		}
	},
	{
		name: '[🕎]→ Ngôi làng bị lưu đày',
		roles: {
			Tanner: 1,
			Investigator: 1,
			Apprentice: 1,
			Evilseer: 1,
			Cupid: 1,
			Bodyguard: 1,
			Mayor: 1,
			Minion: 1,
			Diseased: 1,
			Goodseer: 1,
			Hunter: 1,
			Villager: 3,
			Werewolf: 2,
			Lycan: 1,
			Oldman: 1,
			Witch: 1,
			Fruitbrute: 1
		}
	},
  {
		name: '[🔫]→ Ngôi làng thợ săn',
		roles: {
			Hunter: 5,
			Werewolf: 2
		}
	},
  {
		name: '[🌐]→ Ngôi làng bình thường',
		roles: {
			Villager: 3,
      Bodyguard: 1,
			Werewolf: 1
		}
	},
  	{
		name: '[☯️]→ Làng của tiên tri 1.0',
		roles: {
			Apprentice: 1,
			Cupid: 1,
			Goodseer: 1,
			Villager: 2,
			Werewolf: 2,
		}
	},
	{
		name: '[💀]→ Làng của cái chết',
		roles: {
			Goodseer: 1,
			Witch: 1,
			Werewolf: 2,
			Villager: 5
		}
	},
	{
		name: '[🎭]→ Làng của sự lưỡng lự',
		roles: {
			Evilseer: 1,
			Goodseer: 1,
			Hunter: 1,
			Lycan: 1,
			Werewolf: 1,
			Villager: 5
		}
	},
	{
		name: '[🙇]→ Làng của sự đền tội',
		roles: {
			Evilseer: 1,
			Goodseer: 1,
			Fruitbrute: 1,
			Witch: 1,
			Werewolf: 1,
			Villager: 6
		}
	},
	{
		name: '[🤫]→ Làng nhỏ - Bí mật lớn',
		roles: {
			Apprentice: 1,
			Cupid: 1,
			Evilseer: 1,
			Goodseer: 1,
			Investigator: 1,
			Lycan: 1,
			Tanner: 1,
			Werewolf: 2,
			Villager: 4
		}
	},
	{
		name: '[🐺]→ Làng sói điển hình 2.0',
		roles: {
			Evilseer: 1,
			Goodseer: 1,
			Hunter: 1,
			Cupid: 1,
			Witch: 1,
			Werewolf: 3,
			Villager: 8
		}
	}
];
