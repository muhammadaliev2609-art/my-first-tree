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
	num: "0.3",
	name: "Omega Automation & Balance Update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.3 - The Automation Era (In Progress)</h3><br>
		- Added a new Omega Milestone at 1e222 Omega Points for 5% passive generation.<br>
		- Added Omega Upgrade 14 at 1e272 Omega Points (Points boost Omega gain by ^0.12).<br>
		- Added Omega Upgrade 13 at 1e100 Omega Points to completely automate Prestige upgrades.<br>
		- Implemented a smooth sequential unlock system for Omega Upgrades (11 -> 12 -> 13 -> 14).<br>
		- Added a new Prestige Milestone at 1e49 points (grants x34 points boost, but hardcaps Upgrade 14 to ^0.65).<br>
		- Added a smooth multi-stage softcap to Omega points effect to prevent infinite mathematical explosion.<br>
		- Added Hardcap and Endgame at exactly 1e308 Omega Points.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// Функция проверки конца игры (1e308 очков Омеги)
function isEndgame() {
	return player.o && player.o.unlocked && player.o.points.gte(new ExpantaNum("1e308"))
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

		// ВСТАВЛЕНО СЮДА: Если открыта 5-я веха, софткап жестко режется до 0.65
		if (hasMilestone("p", 5)) {
			exponent = new ExpantaNum(0.65)
		}
		else if (hasMilestone("p", 3)) { 
			exponent = new ExpantaNum(0.9) 
			if (prestigeAmount.gt(new ExpantaNum(10000))) {
				let excess = prestigeAmount.sub(new ExpantaNum(10000))
				let softcappedExcess = excess.pow(new ExpantaNum(0.7)) 
				effPrestige = new ExpantaNum(10000).add(softcappedExcess)
			}
		} 
// ... дальше идет ваш стандартный код else if (hasMilestone("p", 1)) и т.д.


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
	// ВСТАВЛЕНО СЮДА: Бонус от новой 5-й вехи престижа (х34 очков)
	if (hasMilestone("p", 5)) {
		gain = gain.mul(new ExpantaNum(34))
	}

				// 8. БОНУС СЛОЯ ОМЕГА С ЧЕТЫРЕХСТУПЕНЧАТЫМ СОФТКАПОМ (ДОБАВЛЕН ПОРОГ 1e303 С ^0.1)
	if (player.o && player.o.unlocked) {
		let omegaAmount = player.o.points
		let effOmega = omegaAmount

		let limit1 = new ExpantaNum("1e10")
		let limit2 = new ExpantaNum("1e50")
		let limit3 = new ExpantaNum("1e308")
		let limit4 = new ExpantaNum("1e303") // Новый порог перед финалом

		// 1-й порог: после 1e10 рост замедляется до ^0.85
		if (omegaAmount.gt(limit1)) {
			let excess1 = omegaAmount.sub(limit1)
			effOmega = limit1.add(excess1.pow(0.85))
		}

		// 2-й порог: после 1e50 рост замедляется до ^0.7
		if (omegaAmount.gt(limit2)) {
			let baseAtLimit2 = limit1.add(limit2.sub(limit1).pow(0.85))
			let excess2 = omegaAmount.sub(limit2)
			effOmega = baseAtLimit2.add(excess2.pow(0.7))
		}

		// 3-й порог (НОВЫЙ): после 1e303 рост сильно падает до ^0.1
		if (omegaAmount.gt(limit4)) {
			let baseAtLimit2 = limit1.add(limit2.sub(limit1).pow(0.85))
			let baseAtLimit4 = baseAtLimit2.add(limit4.sub(limit2).pow(0.7))
			let excess4 = omegaAmount.sub(limit4)
			effOmega = baseAtLimit4.add(excess4.pow(0.1))
		}

		// 4-й порог: после 1e308 рост жестко замедляется до ^0.5
		if (omegaAmount.gt(limit3)) {
			let baseAtLimit2 = limit1.add(limit2.sub(limit1).pow(0.85))
			let baseAtLimit4 = baseAtLimit2.add(limit4.sub(limit2).pow(0.7))
			let baseAtLimit3 = baseAtLimit4.add(limit3.sub(limit4).pow(0.1))
			let excess3 = omegaAmount.sub(limit3)
			effOmega = baseAtLimit3.add(excess3.pow(0.5))
		}

		let omegaBonus = effOmega.add(new ExpantaNum(1)).pow(1)
		gain = gain.mul(omegaBonus)
	}




	// ВСТАВЛЕНО СЮДА: Эффект 12-го апгрейда Омеги (Степень ^1.33 для обычных очков)
	if (hasUpgrade("o", 12)) {
		gain = gain.pow(new ExpantaNum(1.33))
	}

	return gain
}


// Вспомогательная функция отображения 14-го улучшения (СИНХРОНИЗИРОВАНО НА 0.9)
function getUpgrade14Effect() {
    let prestigeAmount = player.p.points
    let effPrestige = prestigeAmount
    let exponent = new ExpantaNum(0.65)

    // ВСТАВЛЕНО СЮДА: Синхронизация отображения для 5-й вехи
    if (hasMilestone("p", 5)) {
        exponent = new ExpantaNum(0.65)
    }
    else if (hasMilestone("p", 3)) { 
        exponent = new ExpantaNum(0.9)
        if (prestigeAmount.gt(new ExpantaNum(10000))) {
            let excess = prestigeAmount.sub(new ExpantaNum(10000))
            let softcappedExcess = excess.pow(new ExpantaNum(0.7))
            effPrestige = new ExpantaNum(10000).add(softcappedExcess)
        }
    }
// ... дальше идет ваш стандартный код else if (hasMilestone("p", 1)) и т.д.

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
