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
        
        return mult
    },
    
    gainExp() { 
        return new ExpantaNum(1)
    },
    row: 0, 
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){ return true },

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
    
    gainMult() { 
        return new ExpantaNum(1)
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

    effect() {
        return player.o.points.add(new ExpantaNum(1))
    },
    effectDescription() {
        return "which are multiplying your point generation by x" + format(tmp.o.effect)
    }
})
