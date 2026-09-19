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
	num: "0.2",
	name: "Balance & Softcap Update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.2</h3><br>
		- Добавлены жесткие софткапы для предотвращения взрыва очков ee40<br>
		- Перебалансированы цены и степени улучшений`

let winText = `Поздравляем! Вы достигли конца престижного дерева и успешно сбалансировали эту реальность!`

// Условие победы: покупка финального 132 улучшения
function isEndgame() {
	return hasUpgrade("p", 132)
}

var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

function canGenPoints(){
	return true
}

// ГЛОБАЛЬНЫЙ РАСЧЕТ ОЧКОВ В СЕКУНДУ (С ЗАЩИТОЙ ОТ МАТЕМАТИЧЕСКОГО ВЗРЫВА)
function getPointGen() {
	if(!canGenPoints())
		return new ExpantaNum(0)

	// Базовая генерация равна 1
	let gain = new ExpantaNum(1) 

	// === 1. СТАТИЧЕСКИЕ СЛАГАЕМЫЕ (ADD) ===
	if (hasUpgrade("p", 11)) gain = gain.add(upgradeEffect("p", 11)) 
	if (hasUpgrade("p", 33)) gain = gain.add(250) // Исправлено на 250
	if (hasUpgrade("p", 63)) gain = gain.add(1000000)
	if (hasUpgrade("p", 93)) gain = gain.add(new ExpantaNum("1e7")) // Снижено с 1e10
	if (hasUpgrade("p", 112)) gain = gain.add(new ExpantaNum("1e12")) // Снижено с 1e25

	// === 2. МНОЖИТЕЛИ И ЭФФЕКТЫ (MUL) ===
	if (hasUpgrade("p", 12)) gain = gain.mul(2) 
	if (hasUpgrade("p", 13)) gain = gain.mul(upgradeEffect("p", 13)) 
	if (hasUpgrade("p", 21)) gain = gain.mul(upgradeEffect("p", 21)) 
	if (hasUpgrade("p", 22)) gain = gain.mul(upgradeEffect("p", 22)) 
	if (hasUpgrade("p", 41)) gain = gain.mul(upgradeEffect("p", 41))
	if (hasUpgrade("p", 42)) gain = gain.mul(3) // Синхронизировано: x3 вместо x5
	if (hasUpgrade("p", 51)) gain = gain.mul(upgradeEffect("p", 51))
	if (hasUpgrade("p", 53)) gain = gain.mul(50) // Синхронизировано: x50 вместо x500
	
	// Новые ряды
	if (hasUpgrade("p", 61)) gain = gain.mul(upgradeEffect("p", 61))
	if (hasUpgrade("p", 71)) gain = gain.mul(upgradeEffect("p", 71))
	if (hasUpgrade("p", 72)) gain = gain.mul(25)
	if (hasUpgrade("p", 81)) gain = gain.mul(upgradeEffect("p", 81))
	if (hasUpgrade("p", 82)) gain = gain.mul(upgradeEffect("p", 82))
	if (hasUpgrade("p", 91)) gain = gain.mul(upgradeEffect("p", 91))
	if (hasUpgrade("p", 101)) gain = gain.mul(upgradeEffect("p", 101))
	if (hasUpgrade("p", 102)) gain = gain.mul(500) // Снижено с 15000
	if (hasUpgrade("p", 111)) gain = gain.mul(upgradeEffect("p", 111))
	if (hasUpgrade("p", 114)) gain = gain.mul(10000) // Снижено с 1e12
	if (hasUpgrade("p", 121)) gain = gain.mul(upgradeEffect("p", 121))
	if (hasUpgrade("p", 131)) gain = gain.mul(new ExpantaNum("1e15")) // Снижено с 1e50
	if (hasUpgrade("p", 132)) gain = gain.mul(new ExpantaNum("1e25")) // Снижено с 1e100

	// === 3. СТЕПЕННЫЕ МОДИФИКАТОРЫ (POW) ===
	// Степени снижены с 1.05+ до безопасных 1.015-1.02, чтобы предотвратить ee40 хаос
	if (hasUpgrade("p", 31)) gain = gain.pow(1.02)
	if (hasUpgrade("p", 54)) gain = gain.pow(1.02)
	if (hasUpgrade("p", 73)) gain = gain.pow(1.015)
	if (hasUpgrade("p", 84)) gain = gain.pow(1.015)
	if (hasUpgrade("p", 103)) gain = gain.pow(1.015)
	if (hasUpgrade("p", 123)) gain = gain.pow(1.015)

	// === ГЛОБАЛЬНЫЙ ЗАЩИТНЫЙ ХАРДКАП ===
	// Если игра попытается уйти в бесконечность, этот барьер мягко остановит очки
	if (gain.gt("1e300")) {
		gain = new ExpantaNum("1e300")
	}

	return gain
}

function addedPlayerData() { return {} }
var displayThings = []
function maxTickLength() { return(3600) }
function fixOldSave(oldVersion){}
