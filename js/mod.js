let modInfo = {
	name: "The Modding Tree",
	id: "mymod",
	author: "",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum(10), // Старт игры с 10 очками
	offlineLimit: 1,  // В часах
}

// Версия игры
let VERSION = {
	num: "0.2.1",
	name: "Mini Bugfix",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.2.1 - Mini Bugfix</h3><br>
		- Fixed a critical progression bug where point generation would lock at 0 on start.<br>
		- Rearranged Milestones 3 and 4 for smoother scaling.<br>
		- Synchronized Upgrade 14 calculations with the new milestones layout.<br>
		- Fixed number notation! Replaced chaotic comma placement and long decimals with clean scientific notation (e.g. 1.00e6) after 1,000,000.<br><br>
	<h3>v0.2 - Omega Update!</h3><br>
		- Added 2 Milestones<br>
		- Added 1 layer<br>
		- Added 1 upgrade<br>
		- Endgame 1e9 points,1e6 prestige points,10 omega points<br><br>
	<h3>v0.1 - The Beginning</h3><br>
		- Added the first Prestige layer.<br>
		- Created 4 basic upgrades (11-14) with progressive unlocking.<br>
		- Implemented a smooth softcap system for Upgrade 14.<br>
		- Added 2 powerful milestones at 100 and 1000 points.<br>
		- Fully integrated ExpantaNum math engine.<br>
		- Endgame 100000 points`


let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// Функция проверки конца игры (1e9 обычных очков)
function isEndgame() {
	return player.points.gte(new ExpantaNum("1000000000")) // 1e9 обычных очков
}


// Запрет вызова тяжелых функций каждый тик
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

function canGenPoints(){
	return true
}

// ГЛОБАЛЬНЫЙ РАСЧЕТ ОЧКОВ В СЕКУНДУ
function getPointGen() {
	if(!canGenPoints())
		return new ExpantaNum(0)

	// ИСПРАВЛЕНО: Базовый прирост равен 1, иначе без апгрейда 11 игра стоит на месте
	let gain = new ExpantaNum(1) 

	// 1. Улучшение 11 (+1 очко в сек)
	if (hasUpgrade("p", 11)) {
		gain = gain.add(new ExpantaNum(1)) 
	}

	// 2. Улучшение 12 (Умножение на 2)
	if (hasUpgrade("p", 12)) {
		gain = gain.mul(new ExpantaNum(2)) 
	}

	// 3. Улучшение 13 (УСИЛЕНО: возводит в степень 1.4 вместо 1.24)
	if (hasUpgrade("p", 13)) {
		gain = gain.pow(new ExpantaNum(1.4)) 
	}

	// 4. Математика 14-го апгрейда С ДИНАМИЧЕСКИМ СОФТКАПОМ И ИЗМЕНЕНИЕМ СТЕПЕНИ
	if (hasUpgrade("p", 14)) {
		let prestigeAmount = player.p.points
		let effPrestige = prestigeAmount
		let exponent = new ExpantaNum(0.65)

		// СИНХРОНИЗИРОВАНО: теперь это веха 3 (500k points)
		if (hasMilestone("p", 3)) { 
			exponent = new ExpantaNum(0.9) // УСИЛЕНО: теперь степень 0.9 при 3-й вехе
			if (prestigeAmount.gt(new ExpantaNum(10000))) {
				let excess = prestigeAmount.sub(new ExpantaNum(10000))
				let softcappedExcess = excess.pow(new ExpantaNum(0.7)) 
				effPrestige = new ExpantaNum(10000).add(softcappedExcess)
			}
		} 
		else if (hasMilestone("p", 1)) {
			exponent = new ExpantaNum(0.8) 
		} 
		else {
			if (prestigeAmount.gt(new ExpantaNum(10))) {
				let excess = prestigeAmount.sub(new ExpantaNum(10))
				let softcappedExcess = excess.pow(new ExpantaNum(0.4)) 
				effPrestige = new ExpantaNum(10).add(softcappedExcess)
			}
		}

		let bonus = effPrestige.add(new ExpantaNum(1)).pow(exponent)
		gain = gain.mul(bonus)
	}

	// 5. Веха 0 (100 очков) -> х1.5
	if (hasMilestone("p", 0)) {
		gain = gain.mul(new ExpantaNum(1.5)) 
	}

	// 6. Веха 1 (1000 очков) -> х7
	if (hasMilestone("p", 1)) {
		gain = gain.mul(new ExpantaNum(7)) 
	}

	// 7. Веха 2 (1000 престижа) -> Общая степень очков ^1.25
	if (hasMilestone("p", 2)) {
		gain = gain.pow(new ExpantaNum(1.25))
	}

	// 8. Бонус от очков нового слоя Омега (очки + 1)
	if (player.o && player.o.unlocked) {
		let omegaBonus = player.o.points.add(new ExpantaNum(1))
		gain = gain.mul(omegaBonus)
	}

	return gain
}

// Вспомогательная функция отображения 14-го улучшения (СИНХРОНИЗИРОВАНО НА 0.9)
function getUpgrade14Effect() {
    let prestigeAmount = player.p.points
    let effPrestige = prestigeAmount
    let exponent = new ExpantaNum(0.65)

    // СИНХРОНИЗИРОВАНО: изменен индекс вехи с 4 на 3
    if (hasMilestone("p", 3)) { 
        exponent = new ExpantaNum(0.9) // УСИЛЕНО ДО 0.9
        if (prestigeAmount.gt(new ExpantaNum(10000))) {
            let excess = prestigeAmount.sub(new ExpantaNum(10000))
            let softcappedExcess = excess.pow(new ExpantaNum(0.7))
            effPrestige = new ExpantaNum(10000).add(softcappedExcess)
        }
    } 
    else if (hasMilestone("p", 1)) {
        exponent = new ExpantaNum(0.8)
    } 
    else {
        if (prestigeAmount.gt(new ExpantaNum(10))) {
            let excess = prestigeAmount.sub(new ExpantaNum(10))
            let softcappedExcess = excess.pow(new ExpantaNum(0.4))
            effPrestige = new ExpantaNum(10).add(softcappedExcess)
        }
    }

    return {
        exponent: exponent,
        bonus: effPrestige.add(new ExpantaNum(1)).pow(exponent)
    }
}

function addedPlayerData() { return {} }
var displayThings = []
function maxTickLength() { return(3600) }
function fixOldSave(oldVersion){}
