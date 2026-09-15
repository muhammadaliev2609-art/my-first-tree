let modInfo = {
	name: "The Modding Tree",
	id: "mymod",
	author: "",
	pointsName: "points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (10), // Используется для хард-ресета и новых игроков (старт с 10 очками)
	
	offlineLimit: 1,  // В часах
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "First beta release!",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1 - The Beginning</h3><br>
		- Added the first Prestige layer.<br>
		- Created 4 basic upgrades (11-14) with progressive unlocking.<br>
		- Implemented a smooth softcap system for Upgrade 14.<br>
		- Added 2 powerful milestones at 100 and 1000 points.<br>
		- Fully integrated ExpantaNum math engine.
		- Endgame 100000 points`


let winText = `Congratulations! You have reached the end and beaten this game, but for now...`
// Функция, которая каждую секунду проверяет, наступил ли конец игры
function isEndgame() {
	// Игра пройдена, если количество обычных очков БОЛЬШЕ или РАВНО 1,000,000 (1e6)
	return player.points.gte(new ExpantaNum("100000"))
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Расчет очков в секунду по правилам оригинального ExpantaNum
function getPointGen() {
	if(!canGenPoints())
		return new ExpantaNum(0)

	let gain = new ExpantaNum(0) // Изначально 0

	// 1. Проверяем первый апгрейд (базовый +1)
	if (hasUpgrade("p", 11)) {
		gain = gain.add(new ExpantaNum(1)) 
	}

	// 2. Проверяем двенадцатый апгрейд (умножает на 2)
	if (hasUpgrade("p", 12)) {
		gain = gain.mul(new ExpantaNum(2)) 
	}

	// 3. Проверяем тринадцатый апгрейд (возводит в степень 1.24)
	if (hasUpgrade("p", 13)) {
		gain = gain.pow(new ExpantaNum(1.24)) 
	}

	// 4. Математика 14-го апгрейда С ДИНАМИЧЕСКИМ СОФТКАПОМ И ИЗМЕНЕНИЕМ СТЕПЕНИ
	if (hasUpgrade("p", 14)) {
		let prestigeAmount = player.p.points
		let effPrestige = prestigeAmount
		let exponent = new ExpantaNum(0.65) // Базовая степень

		// ПРОВЕРЯЕМ БЕЗУМНУЮ ВЕХУ
		if (hasMilestone("p", 1)) {
			// Если веха получена: степень становится 0.8, софткап НЕ применяется
			exponent = new ExpantaNum(0.8)
		} else {
			// Если вехи НЕТ: применяется старый плавный софткап после 10 очков престижа
			if (prestigeAmount.gt(new ExpantaNum(10))) {
				let excess = prestigeAmount.sub(new ExpantaNum(10))
				let softcappedExcess = excess.pow(new ExpantaNum(0.4))
				effPrestige = new ExpantaNum(10).add(softcappedExcess)
			}
		}

		// Считаем бонус по обновленным параметрам: (Эфф.Престиж + 1)^Степень
		let bonus = effPrestige.add(new ExpantaNum(1)).pow(exponent)
		gain = gain.mul(bonus)
	}

	// 5. Бонус от первой вехи (100 обычных очков) -> x1.5
	if (hasMilestone("p", 0)) {
		gain = gain.mul(new ExpantaNum(1.5)) 
	}

	// 6. БОНУС ОТ ВТОРОЙ БЕЗУМНОЙ ВЕХИ (1000 обычных очков) -> x7
	if (hasMilestone("p", 1)) {
		gain = gain.mul(new ExpantaNum(7)) 
	}

	return gain
}




// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
}

// Less important things beyond this point!

function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

function fixOldSave(oldVersion){
}
