document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT REFERENCES ---
    const categorySelector = document.getElementById('category-selector');
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    const inputValue = document.getElementById('inputValue');
    const resultDisplay = document.getElementById('result');
    const formulaDisplay = document.getElementById('formula');
    const swapButton = document.getElementById('swap-units');
    const themeToggleBtn = document.getElementById('theme-toggle');

    // --- DATA STRUCTURE FOR UNITS ---
    const units = {
        length: {
            name: "Length",
            units: {
                meters: { name: 'Meters', to_base: 1, symbol: 'm' },
                kilometers: { name: 'Kilometers', to_base: 1000, symbol: 'km' },
                miles: { name: 'Miles', to_base: 1609.34, symbol: 'mi' },
                inches: { name: 'Inches', to_base: 0.0254, symbol: 'in' },
                feet: { name: 'Feet', to_base: 0.3048, symbol: 'ft' },
                centimeters: { name: 'Centimeters', to_base: 0.01, symbol: 'cm' }
            }
        },
        weight: {
            name: "Weight",
            units: {
                kilograms: { name: 'Kilograms', to_base: 1, symbol: 'kg' },
                grams: { name: 'Grams', to_base: 0.001, symbol: 'g' },
                pounds: { name: 'Pounds', to_base: 0.453592, symbol: 'lb' },
                ounces: { name: 'Ounces', to_base: 0.0283495, symbol: 'oz' }
            }
        },
        temperature: {
            name: "Temperature",
            units: {
                celsius: { name: 'Celsius', symbol: '°C' },
                fahrenheit: { name: 'Fahrenheit', symbol: '°F' },
                kelvin: { name: 'Kelvin', symbol: 'K' }
            }
        },
        time: {
            name: "Time",
            units: {
                seconds: { name: 'Seconds', to_base: 1, symbol: 's' },
                minutes: { name: 'Minutes', to_base: 60, symbol: 'min' },
                hours: { name: 'Hours', to_base: 3600, symbol: 'hr' },
                days: { name: 'Days', to_base: 86400, symbol: 'day' }
            }
        }
    };

    // --- FUNCTIONS ---

    function getSelectedCategory() {
        return document.querySelector('input[name="category"]:checked').value;
    }

    function populateUnits() {
        const category = getSelectedCategory();
        const unitData = units[category].units;

        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';

        for (const unit in unitData) {
            const option1 = new Option(unitData[unit].name, unit);
            const option2 = new Option(unitData[unit].name, unit);
            fromUnitSelect.add(option1);
            toUnitSelect.add(option2);
        }

        fromUnitSelect.value = Object.keys(unitData)[0];
        toUnitSelect.value = Object.keys(unitData)[1] || Object.keys(unitData)[0];
        convert();
    }

    function convert() {
        let value = parseFloat(inputValue.value);
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        const category = getSelectedCategory();

        if (isNaN(value)) {
            resultDisplay.textContent = '0';
            formulaDisplay.innerHTML = ' ';
            return;
        }

        let result = 0;
        let formula = '';
        const fromSymbol = units[category].units[fromUnit].symbol;
        const toSymbol = units[category].units[toUnit].symbol;

        if (category === 'temperature') {
            if (fromUnit === toUnit) result = value;
            else if (fromUnit === 'celsius' && toUnit === 'fahrenheit') result = (value * 9/5) + 32;
            else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') result = (value - 32) * 5/9;
            else if (fromUnit === 'celsius' && toUnit === 'kelvin') result = value + 273.15;
            else if (fromUnit === 'kelvin' && toUnit === 'celsius') result = value - 273.15;
            else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') result = (value - 32) * 5/9 + 273.15;
            else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') result = (value - 273.15) * 9/5 + 32;
        } else {
            const fromToBase = units[category].units[fromUnit].to_base;
            const toFromBase = units[category].units[toUnit].to_base;
            result = (value * fromToBase) / toFromBase;
        }

        if (fromUnit === toUnit) {
            formula = "Same units selected.";
        } else {
            formula = `${value.toLocaleString()}${fromSymbol} → ${result.toLocaleString(undefined, {maximumFractionDigits: 5})}${toSymbol}`;
        }

        resultDisplay.textContent = result.toLocaleString(undefined, { maximumFractionDigits: 5 });
        formulaDisplay.innerHTML = formula;
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        const themeIcon = themeToggleBtn.querySelector('i');
        themeIcon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    }

    // --- EVENT LISTENERS ---
    categorySelector.addEventListener('change', populateUnits);
    fromUnitSelect.addEventListener('change', convert);
    toUnitSelect.addEventListener('change', convert);
    inputValue.addEventListener('input', convert);

    swapButton.addEventListener('click', () => {
        const fromValue = fromUnitSelect.value;
        fromUnitSelect.value = toUnitSelect.value;
        toUnitSelect.value = fromValue;
        convert();
    });

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // --- INITIALIZATION ---
    const preferredTheme = localStorage.getItem('theme') || 'light';
    setTheme(preferredTheme);
    populateUnits();
});