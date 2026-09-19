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
        
        // Старые модификаторы (Ряды 1-5)
        if (hasUpgrade("p", 14)) mult = mult.mul(upgradeEffect("p", 14))
        if (hasUpgrade("p", 23)) mult = mult.mul(2)
        if (hasUpgrade("p", 32)) mult = mult.mul(upgradeEffect("p", 32))
        if (hasUpgrade("p", 34)) mult = mult.mul(upgradeEffect("p", 34))
        if (hasUpgrade("p", 43)) mult = mult.mul(upgradeEffect("p", 43))
        if (hasUpgrade("p", 52)) mult = mult.mul(10)

        // НОВЫЕ модификаторы престижа (Ряды 6-13)
        if (hasUpgrade("p", 62)) mult = mult.mul(upgradeEffect("p", 62))
        if (hasUpgrade("p", 74)) mult = mult.mul(1000)
        if (hasUpgrade("p", 83)) mult = mult.mul(upgradeEffect("p", 83))
        if (hasUpgrade("p", 92)) mult = mult.mul(upgradeEffect("p", 92))
        if (hasUpgrade("p", 104)) mult = mult.mul(1e6)
        if (hasUpgrade("p", 113)) mult = mult.mul(upgradeEffect("p", 113))
        if (hasUpgrade("p", 124)) mult = mult.mul(new ExpantaNum("1e10"))

        return mult
    },

    gainExp() { 
        let exp = new ExpantaNum(1)
        
        // Старые прорывы экспоненты
        if (hasUpgrade("p", 24)) exp = exp.add(0.1)
        if (hasUpgrade("p", 44)) exp = exp.add(0.1)
        
        // НОВЫЕ прорывы экспоненты
        if (hasUpgrade("p", 64)) exp = exp.add(0.1)
        if (hasUpgrade("p", 94)) exp = exp.add(0.1)
        if (hasUpgrade("p", 122)) exp = exp.add(0.1)
        
        return exp
    },

    gainExp() { 
        let exp = new ExpantaNum(1)
        // Старое улучшение 24
        if (hasUpgrade("p", 24)) exp = exp.add(0.1)
        // Новое улучшение 44: Добавляет еще +0.05 к экспоненте престижа
        if (hasUpgrade("p", 44)) exp = exp.add(0.1)
        return exp
    },

    row: 0, 
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    
    layerShown(){ return true },

    // Улучшения слоя Престиж (По 4 штуки в ряд)
    upgrades: {
        // --- РЯД 1 ---
        11: {
            title: "Генерация очков",
            description: "Производит обычные очки каждую секунду в зависимости от ваших очков престижа.",
            cost: new ExpantaNum(1),
            effect() { return player.p.points.add(1).pow(0.5) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "/sec" },
        },
        12: {
            title: "Ускорение мыслей",
            description: "Умножает генерацию обычных очков на 2.",
            cost: new ExpantaNum(2),
            unlocked() { return hasUpgrade("p", 11) }
        },
        13: {
            title: "Синергия очков",
            description: "Обычные очки умножают сами себя.",
            cost: new ExpantaNum(5),
            unlocked() { return hasUpgrade("p", 12) },
            effect() { return player.points.add(1).log10().add(1).pow(0.5) },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        14: {
            title: "Обратная связь",
            description: "Обычные очки ускоряют получение очков престижа.",
            cost: new ExpantaNum(10),
            unlocked() { return hasUpgrade("p", 13) },
            effect() { return player.points.add(1).log10().pow(0.3).add(1) },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },

        // --- РЯД 2 ---
        21: {
            title: "Престижный буст",
            description: "Очки престижа умножают генерацию обычных очков.",
            cost: new ExpantaNum(25),
            unlocked() { return hasUpgrade("p", 14) },
            effect() { return player.p.points.add(1).pow(0.4) },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        22: {
            title: "Квадратный прогресс",
            description: "Увеличивает базовую генерацию очков в зависимости от купленных улучшений.",
            cost: new ExpantaNum(50),
            unlocked() { return hasUpgrade("p", 21) },
            effect() { return new ExpantaNum(player.p.upgrades.length).pow(2).add(1) },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        23: {
            title: "Двойной сброс",
            description: "Удваивает прирост очков престижа.",
            cost: new ExpantaNum(150),
            unlocked() { return hasUpgrade("p", 22) }
        },
        24: {
            title: "Прорыв экспоненты",
            description: "Повышает экспоненту получения престижа на +0.05.",
            cost: new ExpantaNum(500),
            unlocked() { return hasUpgrade("p", 23) }
        },

                // --- РЯД 3 ---
        31: { 
            title: "Бесконечный поток", 
            description: "Возводит генерацию обычных очков в степень 1.02.", // Снижено с 1.05 для защиты от взрыва
            cost: new ExpantaNum(2000), 
            unlocked() { return hasUpgrade("p", 24) } 
        },
        32: {
            title: "Саморепликация",
            description: "Очки престижа мягко умножают собственное получение.",
            cost: new ExpantaNum(10000),
            unlocked() { return hasUpgrade("p", 31) },
            effect() { 
                let eff = player.p.points.add(1).log10().add(1)
                if (eff.gt(5)) eff = eff.log10().mul(3.5).add(2.5) // Софткап на престиж
                return eff
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        33: { title: "Гипер-генератор", description: "Добавляет +250 к базовой генерации обычных очков.", cost: new ExpantaNum(50000), unlocked() { return hasUpgrade("p", 32) } },
        34: {
            title: "Абстрактный фокус",
            description: "Обычные очки дают контролируемый буст к престижу.",
            cost: new ExpantaNum(1000000),
            unlocked() { return hasUpgrade("p", 33) },
            effect() { 
                let eff = player.points.add(1).log10().pow(0.4).add(1)
                if (eff.gt(15)) eff = eff.log10().mul(8.5) // Софткап
                return eff
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        // --- РЯД 4 (Цены увеличены в 5-10 раз) ---
        41: {
            title: "Энергия накопления",
            description: "Умножает обычные очки на очень слабый корень из текущих очков.",
            cost: new ExpantaNum(15000000), // Было 2млен, стало 15млн
            unlocked() { return hasUpgrade("p", 34) },
            effect() { 
                let eff = player.points.add(1).pow(0.04)
                if (eff.gt(20)) eff = eff.log10().mul(10).add(7)
                return eff
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        42: { title: "Взрывное сжатие", description: "Умножает генерацию обычных очков на 3.", cost: new ExpantaNum(1e8), unlocked() { return hasUpgrade("p", 41) } }, // Было 15млн, стало 100млн
        43: {
            title: "Коллекционер",
            description: "Каждое купленное улучшение престижа увеличивает прирост престижа на 5%.",
            cost: new ExpantaNum(5e8), // Было 80млн, стало 500млн
            unlocked() { return hasUpgrade("p", 42) },
            effect() { return new ExpantaNum(1.05).pow(player.p.upgrades.length) },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        44: { title: "Второй прорыв", description: "Увеличивает экспоненту получения престиж-очков на +0.02.", cost: new ExpantaNum(3e9), unlocked() { return hasUpgrade("p", 43) } }, // Было 5e8, стало 3e9

        // --- РЯД 5 (Цены увеличены в 5-10 раз) ---
        51: {
            title: "Масштабный сдвиг",
            description: "Логарифм очков престижа плавно умножает обычные очки.",
            cost: new ExpantaNum(4e10), // Было 5e9, стало 4e10
            unlocked() { return hasUpgrade("p", 44) },
            effect() { 
                let eff = player.p.points.add(1).log10().pow(1.2).add(1)
                if (eff.gt(50)) eff = eff.log10().mul(25)
                return eff
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        52: { title: "Десятикратный скачок", description: "Умножает получение очков престижа на 4.", cost: new ExpantaNum(3e11), unlocked() { return hasUpgrade("p", 51) } }, // Было 4e10, стало 3e11
        53: { title: "Истинное умножение", description: "Умножает обычные очки на фиксированный бонус (x50).", cost: new ExpantaNum(1e16), unlocked() { return hasUpgrade("p", 52) } }, // Было 5e11, стало 4e12
        54: { title: "Коллапс реальности", description: "Возводит генерацию обычных очков в степень 1.02.", cost: new ExpantaNum(1.5e18), unlocked() { return hasUpgrade("p", 53) } }, // Было 2e13, стало 1.5e14

        // --- РЯД 6 (Цены 61-62 увеличены, а 63 стала дешевле в 500 раз) ---
        61: {
            title: "Сингулярность",
            description: "Обычные очки получают буст.",
            cost: new ExpantaNum("1e21"), // Было 1e15, стало 1e16
            unlocked() { return hasUpgrade("p", 54) },
            effect() { 
                let eff = player.points.add(1).log10().add(1).pow(0.5) 
                if (eff.gt(100)) eff = eff.log10().mul(50)
                return eff
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        62: {
            title: "Антивещество",
            description: "Очки престижа ускоряют собственную генерацию.",
            cost: new ExpantaNum("2e23"), // Было 2e22, стало 2e23
            unlocked() { return hasUpgrade("p", 61) },
            effect() { 
                let eff = player.p.points.add(1).log10().pow(0.4).add(1)
                if (eff.gt(50)) eff = eff.log10().mul(29.4)
                return eff
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        63: { title: "Мгновенный прилив", description: "Добавляет +1,000,000 к базовой генерации обычных очков.", cost: new ExpantaNum("5e26"), unlocked() { return hasUpgrade("p", 62) } }, // Было 1e30 (ДЕШЕВЛЕ В 500 РАЗ!)
        64: { title: "Третий прорыв", description: "Прибавляет еще +0.5 к экспоненте престижа.", cost: new ExpantaNum("1e28"), unlocked() { return hasUpgrade("p", 63) } },

        // --- РЯД 7 ---
        71: {
            title: "Ментальный шторм",
            description: "Умножает обычные очки на слабый корень от обычных очков.",
            cost: new ExpantaNum("1e52"),
            unlocked() { return hasUpgrade("p", 64) },
            effect() { 
                let eff = player.points.add(1).pow(0.05) 
                if (eff.gt(1000)) eff = eff.log10().pow(2).mul(111) // Софткап
                return eff
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        72: { title: "Сжатие времени", description: "Умножает генерацию обычных очков на 25.", cost: new ExpantaNum("1e65"), unlocked() { return hasUpgrade("p", 71) } },
        73: { title: "Тайный коэффициент", description: "Возводит генерацию обычных очков в степень 1.015.", cost: new ExpantaNum("1e78"), unlocked() { return hasUpgrade("p", 72) } },
        74: { title: "Золотая жила", description: "Умножает прирост престиж-очков ровно на 500.", cost: new ExpantaNum("1e90"), unlocked() { return hasUpgrade("p", 73) } },

        // --- РЯД 8 ---
        81: {
            title: "Гравитация",
            description: "Очки престижа дают логарифмический буст обычным очкам.",
            cost: new ExpantaNum("1e105"),
            unlocked() { return hasUpgrade("p", 74) },
            effect() { 
                let eff = player.p.points.add(1).log10().pow(1.5).add(1)
                if (eff.gt(500)) eff = eff.log10().mul(185) // Софткап
                return eff
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        82: {
            title: "Гипер-Коллекция",
            description: "Каждое улучшение престижа дает еще х1.03 к обычным очкам.",
            cost: new ExpantaNum("1e115"),
            unlocked() { return hasUpgrade("p", 81) },
            effect() { return new ExpantaNum(1.03).pow(player.p.upgrades.length) },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        83: {
            title: "Зеркальный эффект",
            description: "Прирост престижа умножается от количества улучшений.",
            cost: new ExpantaNum("1e125"),
            unlocked() { return hasUpgrade("p", 82) },
            effect() { return new ExpantaNum(player.p.upgrades.length).pow(1.1).add(1) },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        84: { title: "Двойная сингулярность", description: "Возводит генерацию обычных очков в степень 1.015.", cost: new ExpantaNum("1e135"), unlocked() { return hasUpgrade("p", 83) } },

        // --- РЯД 9 ---
        91: {
            title: "Фрактальный взрыв",
            description: "Обычные очки умножают сами себя.",
            cost: new ExpantaNum("1e145"),
            unlocked() { return hasUpgrade("p", 84) },
            effect() { 
                let eff = player.points.add(1).log10().pow(1.1).add(1)
                if (eff.gt(1000)) eff = eff.log10().mul(333) // Софткап
                return eff
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        92: {
            title: "Чистый резонанс",
            description: "Прирост престижа мягко умножается от накопленного престижа.",
            cost: new ExpantaNum("1e155"),
            unlocked() { return hasUpgrade("p", 91) },
            effect() { 
                let eff = player.p.points.add(1).log10().pow(0.8).add(1)
                if (eff.gt(200)) eff = eff.log10().mul(86.8) // Софткап
                return eff
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        93: { title: "Ядро фабрики", description: "Добавляет статичные +1e7 к базовой генерации обычных очков.", cost: new ExpantaNum("1e162"), unlocked() { return hasUpgrade("p", 92) } },
        94: { title: "Четвертый прорыв", description: "Прибавляет еще +0.02 к экспоненте престижа.", cost: new ExpantaNum("1e170"), unlocked() { return hasUpgrade("p", 93) } },

        // --- РЯД 10 ---
        101: {
            title: "Квантовый буст",
            description: "Очки престижа дают умножение обычных очков.",
            cost: new ExpantaNum("1e178"),
            unlocked() { return hasUpgrade("p", 94) },
            effect() { 
                let eff = player.p.points.add(1).pow(0.2) 
                if (eff.gt(5000)) eff = eff.log10().pow(3).mul(116) // Жесткий софткап
                return eff
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        102: { title: "Абсолютный разгон", description: "Умножает генерацию обычных очков на 500.", cost: new ExpantaNum("1e185"), unlocked() { return hasUpgrade("p", 101) } },
        103: { title: "Излом пространства", description: "Возводит обычные очки в степень 1.015.", cost: new ExpantaNum("1e192"), unlocked() { return hasUpgrade("p", 102) } },
        104: { title: "Мега Сброс", description: "Дает фиксированный множитель х250 к получению престижа.", cost: new ExpantaNum("1e200"), unlocked() { return hasUpgrade("p", 103) } },

        // --- РЯД 11 ---
        111: {
            title: "Инфляция",
            description: "Обычные очки разгоняют собственную генерацию.",
            cost: new ExpantaNum("1e208"),
            unlocked() { return hasUpgrade("p", 104) },
            effect() { 
                let eff = player.points.add(1).log10().pow(1.5).add(1)
                if (eff.gt(10000)) eff = eff.log10().pow(2).mul(625) // Софткап
                return eff
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        112: { title: "Кузница", description: "Добавляет статичные +1e12 к базовой генерации обычных очков.", cost: new ExpantaNum("1e215"), unlocked() { return hasUpgrade("p", 111) } },
        113: {
            title: "Изоляция",
            description: "Очки престижа дают небольшой множитель к собственному приросту.",
            cost: new ExpantaNum("1e222"),
            unlocked() { return hasUpgrade("p", 112) },
            effect() { 
                let eff = player.p.points.add(1).log10().pow(0.5).add(1)
                if (eff.gt(500)) eff = eff.log10().mul(185) // Софткап
                return eff
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        114: { title: "Космический порядок", description: "Умножает обычные очки на 10,000.", cost: new ExpantaNum("1e228"), unlocked() { return hasUpgrade("p", 113) } },

        // --- РЯД 12 ---
        121: {
            title: "Влияние Бездны",
            description: "Очки престижа бустят генерацию обычных очков.",
            cost: new ExpantaNum("1e234"),
            unlocked() { return hasUpgrade("p", 114) },
            effect() { 
                let eff = player.p.points.add(1).pow(0.25) 
                if (eff.gt(1e5)) eff = eff.log10().pow(3).mul(800) // Софткап
                return eff
            },
            effectDisplay() { return "x" + format(upgradeEffect(this.layer, this.id)) },
        },
        122: { title: "Пятый прорыв", description: "Добавляет финальные +0.02 к экспоненте престижа.", cost: new ExpantaNum("1e240"), unlocked() { return hasUpgrade("p", 121) } },
        123: { title: "Точка сдвига", description: "Возводит обычные очки в степень 1.015.", cost: new ExpantaNum("1e245"), unlocked() { return hasUpgrade("p", 122) } },
        124: { title: "Взрыв Мультивселенной", description: "Умножает получение престиж-очков на 5,000.", cost: new ExpantaNum("1e250"), unlocked() { return hasUpgrade("p", 123) } },

        // --- РЯД 13 ---
        131: { title: "Расширение", description: "Умножает обычные очки на число 1e15.", cost: new ExpantaNum("1e255"), unlocked() { return hasUpgrade("p", 124) } },
        132: { title: "Конец Престижа", description: "Увеличивает генерацию обычных очков на х1е25.", cost: new ExpantaNum("1e260"), unlocked() { return hasUpgrade("p", 131) } }

    },
})
