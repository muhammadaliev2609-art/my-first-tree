function exponentialFormat(num, precision, mantissa = true) {
    return num.toString(precision)
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.array[0][1] < 0.001) return (0).toFixed(precision)
    return num.toStringWithDecimalPlaces(Math.max(precision,2)).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
}

function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function regularFormat(num, precision) {
    if (isNaN(num)) return "NaN"
    if (num.array[0][1] < 0.001) return (0).toFixed(precision)
    return num.toString(Math.max(precision,2))
}

function fixValue(x, y = 0) {
    return x || new ExpantaNum(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return new ExpantaNum(0)
    return x.reduce((a, b) => ExpantaNum.add(a, b))
}

function format(decimal, precision = 2, small = false) {
    small = small || modInfo.allowSmall
    decimal = new ExpantaNum(decimal)

    // 1. Базовые проверки на некорректные значения, ноль и минус
    if (decimal.eq(0)) return "0"
    if (decimal.lt(0)) return "-" + format(decimal.neg(), precision, small)

    // Порог переключения на научную нотацию (1,000,000)
    let threshold = new ExpantaNum(1000000)

    // 2. НАУЧНАЯ НОТАЦИЯ ДЛЯ БОЛЬШИХ ЧИСЕЛ (>= 1,000,000)
    if (decimal.gte(threshold)) {
        // Если число уходит в супер-гигантские слои ExpantaNum (больше 1e9e15)
        if (decimal.layer > 1) {
            return decimal.toString()
        }

        // Берем чистые значения мантиссы и экспоненты напрямую из ExpantaNum
        let exp = decimal.log10().floor()
        let mantissa = decimal.div(ExpantaNum.pow(10, exp))

        // Корректируем возможную погрешность (чтобы не выводилось 10.00e5 вместо 1.00e6)
        if (mantissa.gte(10)) {
            mantissa = mantissa.div(10)
            exp = exp.add(1)
        }

        return mantissa.toNumber().toFixed(precision) + "e" + exp.toString()
    }

    // 3. БЕЗОПАСНЫЙ ВЫВОД ДЛЯ МАЛЕНЬКИХ ЧИСЕЛ (< 1,000,000)
    // Превращаем маленькое ExpantaNum в обычное JavaScript число для вывода без багов
    let num = decimal.toNumber()
    
    if (precision === 0) {
        return Math.floor(num).toString()
    }
    
    return num.toFixed(precision)
}

function formatWhole(decimal) {
    return format(decimal,0)
}

function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function toPlaces(x, precision, maxAccepted) {
    x = new ExpantaNum(x)
    let result = x.toString(precision)
    if (new ExpantaNum(result).gte(maxAccepted)) {
        result = new ExpantaNum(maxAccepted - Math.pow(0.1, precision)).toString(precision)
    }
    return result
}
