// ==========================================
// СЛОЙ 1: ПРЕСТИЖ (PRESTIGE)
// ==========================================
addLayer("p", {
    name: "prestige", 
    symbol: "P", 
    position: 0, 
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#4BDC13",
    requires: new ExpantaNum(10), 
    resource: "prestige points", 
    baseResource: "points", 
    baseAmount() { return player.points }, 
    type: "normal", 
    exponent: 0.5, 
    
        // Модификаторы получения очков престижа
    gainMult() { 
        let mult = new ExpantaNum(1)
        
        if (hasMilestone("p", 0)) {
            mult = mult.mul(new ExpantaNum(1.5))
        }

        if (hasMilestone("p", 2)) {
            mult = mult.mul(new ExpantaNum(4)) 
        }

        if (hasMilestone("p", 3)) {
            mult = mult.mul(new ExpantaNum(5)) 
        }

        // ВСТАВЛЕНО СЮДА: Если куплен апгрейд Омеги 11, умножаем прирост престижа на его эффект
        if (hasUpgrade("o", 11)) {
            mult = mult.mul(upgradeEffect("o", 11))
        }
        
        return mult
    },

   // Стало (замените на это):
    gainExp() { 
        let exp = new ExpantaNum(1)
        // Если куплен 12-й апгрейд Омеги, увеличиваем экспоненту престиж-очков до 1.11
        if (hasUpgrade("o", 12)) {
            exp = exp.mul(new ExpantaNum(1.11))
        }
        return exp
    },
    row: 0, 
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){ return true },
        // Автоматический прирост престиж-очков и покупка апгрейдов
    update(diff) {
        if (player.o && player.o.unlocked && hasMilestone("o", 0)) {
            let gain = tmp.p.resetGain
            if (gain.gt(0)) {
                player.p.points = player.p.points.add(gain.mul(diff))
            }
        }
        
        // ВСТАВЛЕНО СЮДА: Если куплен 13-й апгрейд Омеги, автоматически покупаем все апгрейды престижа
        if (hasUpgrade("o", 13)) {
            buyUpgrade("p", 11);
            buyUpgrade("p", 12);
            buyUpgrade("p", 13);
            buyUpgrade("p", 14);
            buyUpgrade("p", 15);
        }
    },

        // СПИСОК ВЕХ (MILESTONES)
    milestones: {
        0: {
            requirementDescription: "100 points",
            effectDescription: "You hit a milestone! Gain 1.5x points and prestige points.",
            done() { return player.points.gte(new ExpantaNum(100)) }
        },
        1: {
            requirementDescription: "1000 points",
            effectDescription: "This milestone is insane!!! Removes softcap from Upgrade 14, increases its exponent from 0.65 to 0.8, and grants 7x points.",
            done() { return player.points.gte(new ExpantaNum(1000)) }
        },
        2: {
            requirementDescription: "1000 prestige points",
            effectDescription: "Gain ^1.25 points and 4x prestige points.",
            done() { return player.p.points.gte(new ExpantaNum(1000)) }
        },
        3: {
            requirementDescription: "500,000 points", // ТЕПЕРЬ ТРЕТЬЯ ВЕХА
            effectDescription: "Did you enjoy upgrading Upgrade 14? Then take this: Upgrade 14 is buffed from ^0.80 to ^0.9, but a softcap of ^0.7 applies after 10000 prestige points.",
            done() { return player.points.gte(new ExpantaNum(500000)) } 
        },
        4: {
            requirementDescription: "10,000 prestige points", // ТЕПЕРЬ ЧЕТВЕРТАЯ ВЕХА
            effectDescription: "Prestige point gain is multiplied by 5x.",
            done() { return player.p.points.gte(new ExpantaNum(10000)) } 
        },
        5: {
            requirementDescription: "10,000 prestige points",
            effectDescription: "Prestige point gain is multiplied by 5x.",
            done() { return player.p.points.gte(new ExpantaNum(10000)) } 
        },
        // ВСТАВЛЕНО СЮДА: Новая 5-я веха престижа
        5: {
            requirementDescription: "1e49 points",
            effectDescription: "Gain 34x points, but Upgrade 14 softcap is reduced to ^0.65.",
            done() { return player.points.gte(new ExpantaNum("1e49")) }
        }

    },

    // СПИСОК УЛУЧШЕНИЙ (UPGRADES)
    upgrades: {
        11: {
            title: "Start Generation",
            description: "Enables passive income. Grants +1 point per second.",
            cost: new ExpantaNum(1),
        },
        12: {
            title: "Double the Flow",
            description: "Multiplies total point generation by 2.",
            cost: new ExpantaNum(2),
            unlocked() { return hasUpgrade("p", 11) },
        },
        13: {
            title: "Weak Boost?",
            description: "Raises total point generation to the power of 1.4.", 
            cost: new ExpantaNum(5),
            unlocked() { return hasUpgrade("p", 12) },
        },
        14: {
            title: "Prestige Synergy",
            effect() { return getUpgrade14Effect().bonus }, // ИСПРАВЛЕНО: добавлен расчет эффекта для TMT системы
            description() { 
                let effect = getUpgrade14Effect()
                let exponentText = format(effect.exponent)
                let formattedBonus = format(effect.bonus)
                
                let softcapText = "Softcap ^0.4 applies after 10 prestige points."
                if (hasMilestone("p", 4)) { 
                    softcapText = "Softcap ^0.7 applies after 10000 prestige points."
                } else if (hasMilestone("p", 1)) {
                    softcapText = "Softcap is removed!"
                }

                return "Prestige points increase point generation by (Prestige Points + 1)^" + exponentText + ". " + softcapText + " Current Multiplier: x" + formattedBonus
            },
            cost: new ExpantaNum(7),
            unlocked() { return hasUpgrade("p", 13) },
        },
        15: {
            title: "Unlock the next layer",
            description: "Allows you to progress further and see what lies beyond.",
            cost: new ExpantaNum(100000), 
            unlocked() { return hasUpgrade("p", 14) }, 
        },
    },
})

// ==========================================
// СЛОЙ 2: ОМЕГА (OMEGA)
// ==========================================
addLayer("o", {
    name: "omega", 
    symbol: "Ω", 
    position: 0, 
    startData() { return {
        unlocked: false, 
		points: new ExpantaNum(0),
    }},
    color: "#8A2BE2", 
    requires: new ExpantaNum(100000), 
    resource: "omega points", 
    baseResource: "prestige points", 
    baseAmount() { return player.p.points }, 
    type: "normal", 
    exponent: 0.5, 
    
   // Модификаторы получения очков Омеги
    gainMult() { 
        let mult = new ExpantaNum(1)
        
        // ВСТАВЛЕНО СЮДА: Если куплен Апгрейд 14 Омеги, умножаем её прирост на его эффект
        if (hasUpgrade("o", 14)) {
            mult = mult.mul(upgradeEffect("o", 14))
        }
        
        return mult
    },
    gainExp() { 
        return new ExpantaNum(1)
    },
    row: 1, 
    hotkeys: [
        {key: "o", description: "O: Reset for omega points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    
    layerShown() { 
        return hasUpgrade("p", 15) 
    },

        update(diff) {
        if (hasMilestone("o", 1)) {
            let gain = tmp.o.resetGain
            player.o.points = player.o.points.add(gain.mul(diff).mul(0.05))
        }

		// ВСТАВЛЕНО СЮДА: Жесткий хардкап Омеги на значении 1e308
		if (player.o.points.gte(new ExpantaNum("1e308"))) {
			player.o.points = new ExpantaNum("1e308")
		}
    },



               effect() {
        let omegaAmount = player.o.points
        let effOmega = omegaAmount

        let limit1 = new ExpantaNum("1e10")
        let limit2 = new ExpantaNum("1e50")
        let limit3 = new ExpantaNum("1e308")
        let limit4 = new ExpantaNum("1e303")

        if (omegaAmount.gt(limit1)) {
            let excess1 = omegaAmount.sub(limit1)
            effOmega = limit1.add(excess1.pow(0.85))
        }
        if (omegaAmount.gt(limit2)) {
            let baseAtLimit2 = limit1.add(limit2.sub(limit1).pow(0.85))
            let excess2 = omegaAmount.sub(limit2)
            effOmega = baseAtLimit2.add(excess2.pow(0.7))
        }
        if (omegaAmount.gt(limit4)) {
            let baseAtLimit2 = limit1.add(limit2.sub(limit1).pow(0.85))
            let baseAtLimit4 = baseAtLimit2.add(limit4.sub(limit2).pow(0.7))
            let excess4 = omegaAmount.sub(limit4)
            effOmega = baseAtLimit4.add(excess4.pow(0.1))
        }
        if (omegaAmount.gt(limit3)) {
            let baseAtLimit2 = limit1.add(limit2.sub(limit1).pow(0.85))
            let baseAtLimit4 = baseAtLimit2.add(limit4.sub(limit2).pow(0.7))
            let baseAtLimit3 = baseAtLimit4.add(limit3.sub(limit4).pow(0.1))
            let excess3 = omegaAmount.sub(limit3)
            effOmega = baseAtLimit3.add(excess3.pow(0.5))
        }

        return effOmega.add(new ExpantaNum(1)).pow(1)
    },
    effectDescription() {
        let omegaAmount = player.o.points
        let softcapText = ""
        
        if (omegaAmount.gt(new ExpantaNum("1e308"))) softcapText = " (Hardcapped)"
        else if (omegaAmount.gt(new ExpantaNum("1e303"))) softcapText = " (Softcapped: Growth ^0.1)"
        else if (omegaAmount.gt(new ExpantaNum("1e50"))) softcapText = " (Softcapped: Growth ^0.7)"
        else if (omegaAmount.gt(new ExpantaNum("1e10"))) softcapText = " (Softcapped: Growth ^0.85)"
        
        return "which are multiplying your point generation by x" + format(tmp.o.effect) + softcapText
    },



            // СПИСОК ВЕХ (MILESTONES) СЛОЯ ОМЕГА
    milestones: {
        0: {
            requirementDescription: "10 Omega Points",
            effectDescription: "Unlock 100% passive Prestige generation per second without resetting.",
            done() { return player.o.points.gte(new ExpantaNum(10)) }
        },
        // ВСТАВЛЕНО СЮДА: Новая 1-я веха Омеги
        1: {
            requirementDescription: "1e222 Omega Points",
            effectDescription: "Gain 5% of Omega points gained on reset per second passively without resetting.",
            done() { return player.o.points.gte(new ExpantaNum("1e222")) }
        }
    },
    // АПГРЕЙДЫ СЛОЯ ОМЕГА (ИСПРАВЛЕНА ПОСЛЕДОВАТЕЛЬНОСТЬ СКРЫТИЯ)
    upgrades: {
        11: {
            title: "Omega Singularity",
            description() {
                return "Total Omega points multiply Prestige point gain to the power of 0.35. Current Multiplier: x" + format(this.effect())
            },
            cost: new ExpantaNum(50),
            effect() {
                let totalOmega = player.o.best || new ExpantaNum(0)
                return totalOmega.add(new ExpantaNum(1)).pow(new ExpantaNum(0.35))
            },
            unlocked() { return player.o.unlocked } // Виден всегда, когда открыт слой
        },
        12: {
            title: "Omega Transcendence",
            description: "Points generation is raised to the power of 1.33, and Prestige points gain is raised to the power of 1.11.",
            cost: new ExpantaNum(1000),
            unlocked() { return hasUpgrade("o", 11) } // Появляется строго после покупки 11-го
        },
        13: {
            title: "Prestige Automation",
            description: "Automatically purchases all 5 Prestige upgrades.",
            cost: new ExpantaNum("1e100"),
            unlocked() { return hasUpgrade("o", 12) } // ИСПРАВЛЕНО: проверяет слой "o", а не "p"!
        },
        14: {
            title: "Infinite Convergence",
            description() {
                return "Points boost Omega points gain to the power of 0.008. Current Multiplier: x" + format(this.effect())
            },
            cost: new ExpantaNum("1e272"),
            effect() {
                return player.points.add(new ExpantaNum(1)).pow(new ExpantaNum(0.008))
            },
            unlocked() { return hasUpgrade("o", 13) } // Появляется после покупки 13-го
        }
    }


})
