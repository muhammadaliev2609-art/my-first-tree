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
    baseAmount() {return player.points}, 
    type: "normal", 
    exponent: 0.5, 
    
    // Модификатор получения ОЧКОВ ПРЕСТИЖА
    gainMult() { 
        let mult = new ExpantaNum(1)
        
        // Веха 0 теперь дает в 1.5 раза больше престижа при сбросе
        if (hasMilestone("p", 0)) {
            mult = mult.mul(new ExpantaNum(1.5))
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
    layerShown(){return true},

           // MILESTONES BLOCK
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
        }
    },


       // UPGRADES BLOCK
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
            description: "Raises total point generation to the power of 1.24.",
            cost: new ExpantaNum(5),
            unlocked() { return hasUpgrade("p", 12) },
        },
        14: {
            title: "Prestige Synergy",
            description() { 
                let prestigeAmount = player.p.points
                let effPrestige = prestigeAmount

                if (prestigeAmount.gt(new ExpantaNum(10))) {
                    let excess = prestigeAmount.sub(new ExpantaNum(10))
                    let softcappedExcess = excess.pow(new ExpantaNum(0.4))
                    effPrestige = new ExpantaNum(10).add(softcappedExcess)
                }

                let currentBonus = effPrestige.add(new ExpantaNum(1)).pow(new ExpantaNum(0.65))
                let formattedBonus = format(currentBonus)

                return "Prestige points increase point generation by (Prestige Points + 1)^0.65. Softcap ^0.4 applies after 10 prestige points. \"\" Current Multiplier: x" + formattedBonus
            },
            cost: new ExpantaNum(7),
            unlocked() { return hasUpgrade("p", 13) },
        },
    },

})
