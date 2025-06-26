
        // Global variables
        let currentTab = 'converter';
        let currentInputMode = 'single';
        let selectedOperation = '+';
        let realTimeEnabled = false;
        let realTimeTimeout;
        let processMode1 = 'concat'; // 'concat' or 'sum'
        let processMode2 = 'concat'; // 'concat' or 'sum'

        // Initialize space effects
        function initSpaceEffects() {
            createStars();
            
            // Create shooting stars periodically
            setInterval(createShootingStar, Math.random() * 3000 + 1000);
            
            // Create multiple shooting stars at once occasionally
            setInterval(() => {
                const count = Math.floor(Math.random() * 5) + 3;
                for (let i = 0; i < count; i++) {
                    setTimeout(createShootingStar, i * 200);
                }
            }, Math.random() * 10000 + 5000);
        }

        // Create stars
        function createStars() {
            const starsContainer = document.getElementById('stars');
            for (let i = 0; i < 200; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.width = Math.random() * 3 + 1 + 'px';
                star.style.height = star.style.width;
                star.style.animationDelay = Math.random() * 3 + 's';
                star.style.animationDuration = (Math.random() * 3 + 2) + 's';
                starsContainer.appendChild(star);
            }
        }

        // Create shooting stars
        function createShootingStar() {
            const shootingStar = document.createElement('div');
            shootingStar.className = 'shooting-star';
            shootingStar.style.left = Math.random() * 100 + '%';
            shootingStar.style.top = Math.random() * 50 + '%';
            shootingStar.style.animation = `shoot ${Math.random() * 3 + 2}s linear`;
            
            document.body.appendChild(shootingStar);
            
            setTimeout(() => {
                shootingStar.remove();
            }, 5000);
        }

        // Tab switching
        function switchTab(tab) {
            currentTab = tab;
            const converterTab = document.getElementById('converterTab');
            const calculatorTab = document.getElementById('calculatorTab');
            const converterSection = document.getElementById('converterSection');
            const calculatorSection = document.getElementById('calculatorSection');
            
            if (tab === 'converter') {
                converterTab.classList.add('active');
                calculatorTab.classList.remove('active');
                converterSection.style.display = 'block';
                calculatorSection.style.display = 'none';
            } else {
                calculatorTab.classList.add('active');
                converterTab.classList.remove('active');
                converterSection.style.display = 'none';
                calculatorSection.style.display = 'block';
            }
        }

        // Input mode toggle
        function toggleInputMode(mode) {
            currentInputMode = mode;
            const singleLineMode = document.getElementById('singleLineMode');
            const multiLineMode = document.getElementById('multiLineMode');
            const singleLineSection = document.getElementById('singleLineSection');
            const multiLineSection = document.getElementById('multiLineSection');
            
            if (mode === 'single') {
                singleLineMode.classList.add('active');
                multiLineMode.classList.remove('active');
                singleLineSection.classList.remove('hidden');
                multiLineSection.classList.add('hidden');
            } else {
                multiLineMode.classList.add('active');
                singleLineMode.classList.remove('active');
                singleLineSection.classList.add('hidden');
                multiLineSection.classList.remove('hidden');
            }
        }

        // Toggle process mode for multi-line
        function toggleProcessMode(inputNum) {
            if (inputNum === 1) {
                processMode1 = processMode1 === 'concat' ? 'sum' : 'concat';
                document.getElementById('mode1Display').textContent = 
                    processMode1 === 'concat' ? 'Gabung Baris' : 'Jumlah Baris';
            } else {
                processMode2 = processMode2 === 'concat' ? 'sum' : 'concat';
                document.getElementById('mode2Display').textContent = 
                    processMode2 === 'concat' ? 'Gabung Baris' : 'Jumlah Baris';
            }
            autoCalculateMulti();
        }

        // Operation selection
        function selectOperation(operation) {
            selectedOperation = operation;
            const buttons = document.querySelectorAll('.operation-button');
            buttons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.textContent.includes(operation)) {
                    btn.classList.add('active');
                }
            });
            
            // Auto calculate if inputs have values
            if (currentInputMode === 'single') {
                const num1 = document.getElementById('calcNum1').value.trim();
                const num2 = document.getElementById('calcNum2').value.trim();
                if (num1 && num2) {
                    calculateOperation();
                }
            } else {
                const num1 = document.getElementById('calcNumMulti1').value.trim();
                const num2 = document.getElementById('calcNumMulti2').value.trim();
                if (num1 && num2) {
                    calculateMultiOperation();
                }
            }
        }

        // Process multi-line input
        function processMultiLineInput(text, base, mode) {
            const lines = text.split('\n').map(line => line.trim()).filter(line => line);
            
            if (mode === 'sum') {
                // Sum all lines
                let total = 0;
                for (const line of lines) {
                    if (!validateInput(line, base)) {
                        throw `Baris "${line}" tidak valid untuk ${getBaseName(base)}`;
                    }
                    total += parseInt(line, base);
                }
                return total;
            } else {
                // Concatenate all lines
                const concatenated = lines.join('');
                if (!validateInput(concatenated, base)) {
                    throw `Input gabungan tidak valid untuk ${getBaseName(base)}`;
                }
                return parseInt(concatenated, base);
            }
        }

        // Multi-line calculator
        function calculateMultiOperation() {
            const num1Text = document.getElementById('calcNumMulti1').value.trim();
            const base1 = parseInt(document.getElementById('calcBaseMulti1').value);
            const num2Text = document.getElementById('calcNumMulti2').value.trim();
            const base2 = parseInt(document.getElementById('calcBaseMulti2').value);
            const resultBase = parseInt(document.getElementById('calcResultBase').value);
            const output = document.getElementById('calcOutput');

            output.innerHTML = '';
            output.classList.remove('show');

            if (!num1Text || !num2Text) {
                showCalcError('🌠 Masukkan kedua input untuk memulai kalkulasi', 'warning');
                return;
            }

            try {
                // Process multi-line inputs
                const decimal1 = processMultiLineInput(num1Text, base1, processMode1);
                const decimal2 = processMultiLineInput(num2Text, base2, processMode2);
                
                if (isNaN(decimal1) || isNaN(decimal2)) {
                    throw 'Input tidak valid';
                }

                // Perform operation
                let result;
                switch (selectedOperation) {
                    case '+':
                        result = decimal1 + decimal2;
                        break;
                    case '-':
                        result = decimal1 - decimal2;
                        break;
                    case '×':
                        result = decimal1 * decimal2;
                        break;
                    case '÷':
                        if (decimal2 === 0) {
                            throw 'Tidak dapat membagi dengan nol';
                        }
                        result = Math.floor(decimal1 / decimal2);
                        break;
                    case '%':
                        if (decimal2 === 0) {
                            throw 'Tidak dapat modulo dengan nol';
                        }
                        result = decimal1 % decimal2;
                        break;
                    default:
                        throw 'Operasi tidak valid';
                }

                // Handle negative results
                const isNegative = result < 0;
                result = Math.abs(result);
                
                // Convert result to target base
                const resultString = result.toString(resultBase).toUpperCase();
                const finalResult = isNegative ? '-' + resultString : resultString;

                showMultiCalcResult(finalResult, num1Text, base1, num2Text, base2, resultBase, decimal1, decimal2, result, isNegative);
                
            } catch (e) {
                showCalcError(`❌ Error: ${e}`);
            }
        }

        // Show multi-line calculation result
        function showMultiCalcResult(finalResult, num1Text, base1, num2Text, base2, resultBase, decimal1, decimal2, result, isNegative) {
            const output = document.getElementById('calcOutput');
            
            const lines1 = num1Text.split('\n').map(line => line.trim()).filter(line => line);
            const lines2 = num2Text.split('\n').map(line => line.trim()).filter(line => line);
            
            let outputHTML = `
                <div class="result-cosmic p-8 rounded-2xl shadow-lg">
                    <div class="flex items-center justify-between gap-3 text-green-400 text-xl font-semibold mb-6">
                        <div class="flex items-center gap-3">
                            <span>🌟</span>
                            <span>Kalkulasi Multi-Line Berhasil!</span>
                        </div>
                        <button class="cosmic-input border border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg px-4 py-2 text-sm transition-all duration-300" onclick="copyResult('${finalResult}')" title="Salin hasil">
                            📋 Salin
                        </button>
                    </div>
                    
                    <div class="text-center mb-8">
                        <div class="inline-block font-mono text-4xl font-extrabold bg-gradient-to-br from-[#8a2be2] via-[#1e90ff] via-[#ff1493] via-[#00ff7f] to-[#8a2be2] bg-[length:400%_400%] bg-clip-text text-transparent p-6 rounded-xl border-2 border-purple-600/50 bg-[rgba(5,5,15,0.95)] animate-[cosmicGradient_6s_ease-in-out_infinite]">
                            ${finalResult}
                        </div>
                    </div>

                    <div class="mt-8 p-6 bg-[rgba(5,5,15,0.7)] backdrop-blur-md rounded-lg border-l-4 border-purple-600 shadow-md">
                        <h4 class="text-purple-400 font-semibold text-lg mb-4 flex items-center gap-2">🧮 Detail Kalkulasi Multi-Line:</h4>
                        <div class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div class="bg-[rgba(5,5,15,0.5)] p-4 rounded-lg">
                                    <div class="text-purple-300 font-medium">🚀 Input Pertama (${processMode1 === 'concat' ? 'Gabung' : 'Jumlah'}):</div>
                                    <div class="text-white font-mono text-sm mb-2">
                                        ${lines1.map(line => `"${line}"`).join(' + ')}
                                    </div>
                                    <div class="text-purple-400 text-sm">${getBaseName(base1)}</div>
                                    <div class="text-gray-300 text-sm">= ${decimal1} (Desimal)</div>
                                </div>
                                <div class="bg-[rgba(5,5,15,0.5)] p-4 rounded-lg">
                                    <div class="text-purple-300 font-medium">🎯 Input Kedua (${processMode2 === 'concat' ? 'Gabung' : 'Jumlah'}):</div>
                                    <div class="text-white font-mono text-sm mb-2">
                                        ${lines2.map(line => `"${line}"`).join(' + ')}
                                    </div>
                                    <div class="text-purple-400 text-sm">${getBaseName(base2)}</div>
                                    <div class="text-gray-300 text-sm">= ${decimal2} (Desimal)</div>
                                </div>
                            </div>
                            
                            <div class="bg-[rgba(5,5,15,0.5)] p-4 rounded-lg">
                                <div class="text-purple-300 font-medium mb-2">🔬 Proses Kalkulasi:</div>
                                <div class="text-white font-mono">
                                    ${decimal1} ${selectedOperation} ${decimal2} = ${isNegative ? '-' : ''}${result} (Desimal)
                                </div>
                                <div class="text-gray-300 text-sm mt-2">
                                    Dikonversi ke ${getBaseName(resultBase)}: ${finalResult}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

            output.innerHTML = outputHTML;
            setTimeout(() => output.classList.add('show'), 50);
        }

        // Single line calculator functions
        function calculateOperation() {
            const num1 = document.getElementById('calcNum1').value.trim();
            const base1 = parseInt(document.getElementById('calcBase1').value);
            const num2 = document.getElementById('calcNum2').value.trim();
            const base2 = parseInt(document.getElementById('calcBase2').value);
            const resultBase = parseInt(document.getElementById('calcResultBase').value);
            const output = document.getElementById('calcOutput');

            output.innerHTML = '';
            output.classList.remove('show');

            if (!num1 || !num2) {
                showCalcError('🌠 Masukkan kedua angka untuk memulai kalkulasi', 'warning');
                return;
            }

            // Validate inputs
            if (!validateInput(num1, base1)) {
                showCalcError(`🚫 Angka pertama tidak valid untuk ${getBaseName(base1)}`, `Karakter yang diizinkan: ${getValidChars(base1)}`);
                return;
            }

            if (!validateInput(num2, base2)) {
                showCalcError(`🚫 Angka kedua tidak valid untuk ${getBaseName(base2)}`, `Karakter yang diizinkan: ${getValidChars(base2)}`);
                return;
            }

            try {
                // Convert to decimal
                const decimal1 = parseInt(num1, base1);
                const decimal2 = parseInt(num2, base2);
                
                if (isNaN(decimal1) || isNaN(decimal2)) {
                    throw 'Angka tidak valid';
                }

                // Perform operation
                let result;
                switch (selectedOperation) {
                    case '+':
                        result = decimal1 + decimal2;
                        break;
                    case '-':
                        result = decimal1 - decimal2;
                        break;
                    case '×':
                        result = decimal1 * decimal2;
                        break;
                    case '÷':
                        if (decimal2 === 0) {
                            throw 'Tidak dapat membagi dengan nol';
                        }
                        result = Math.floor(decimal1 / decimal2);
                        break;
                    case '%':
                        if (decimal2 === 0) {
                            throw 'Tidak dapat modulo dengan nol';
                        }
                        result = decimal1 % decimal2;
                        break;
                    default:
                        throw 'Operasi tidak valid';
                }

                // Handle negative results
                const isNegative = result < 0;
                result = Math.abs(result);
                
                // Convert result to target base
                const resultString = result.toString(resultBase).toUpperCase();
                const finalResult = isNegative ? '-' + resultString : resultString;

                showCalcResult(finalResult, num1, base1, num2, base2, resultBase, decimal1, decimal2, result, isNegative);
                
            } catch (e) {
                showCalcError(`❌ Error: ${e}`);
            }
        }

        // Show single line calculation result
        function showCalcResult(finalResult, num1, base1, num2, base2, resultBase, decimal1, decimal2, result, isNegative) {
            const output = document.getElementById('calcOutput');
            
            let outputHTML = `
                <div class="result-cosmic p-8 rounded-2xl shadow-lg">
                    <div class="flex items-center justify-between gap-3 text-green-400 text-xl font-semibold mb-6">
                        <div class="flex items-center gap-3">
                            <span>🌟</span>
                            <span>Kalkulasi Berhasil!</span>
                        </div>
                        <button class="cosmic-input border border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg px-4 py-2 text-sm transition-all duration-300" onclick="copyResult('${finalResult}')" title="Salin hasil">
                            📋 Salin
                        </button>
                    </div>
                    
                    <div class="text-center mb-8">
                        <div class="inline-block font-mono text-4xl font-extrabold bg-gradient-to-br from-[#8a2be2] via-[#1e90ff] via-[#ff1493] via-[#00ff7f] to-[#8a2be2] bg-[length:400%_400%] bg-clip-text text-transparent p-6 rounded-xl border-2 border-purple-600/50 bg-[rgba(5,5,15,0.95)] animate-[cosmicGradient_6s_ease-in-out_infinite]">
                            ${finalResult}
                        </div>
                    </div>

                    <div class="mt-8 p-6 bg-[rgba(5,5,15,0.7)] backdrop-blur-md rounded-lg border-l-4 border-purple-600 shadow-md">
                        <h4 class="text-purple-400 font-semibold text-lg mb-4 flex items-center gap-2">🧮 Detail Kalkulasi:</h4>
                        <div class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div class="bg-[rgba(5,5,15,0.5)] p-4 rounded-lg">
                                    <div class="text-purple-300 font-medium">🚀 Angka Pertama:</div>
                                    <div class="text-white font-mono text-lg">${num1} <span class="text-purple-400">(${getBaseName(base1)})</span></div>
                                    <div class="text-gray-300 text-sm">= ${decimal1} (Desimal)</div>
                                </div>
                                <div class="bg-[rgba(5,5,15,0.5)] p-4 rounded-lg">
                                    <div class="text-purple-300 font-medium">⚡ Operasi:</div>
                                    <div class="text-white font-mono text-2xl text-center">${selectedOperation}</div>
                                </div>
                                <div class="bg-[rgba(5,5,15,0.5)] p-4 rounded-lg">
                                    <div class="text-purple-300 font-medium">🎯 Angka Kedua:</div>
                                    <div class="text-white font-mono text-lg">${num2} <span class="text-purple-400">(${getBaseName(base2)})</span></div>
                                    <div class="text-gray-300 text-sm">= ${decimal2} (Desimal)</div>
                                </div>
                            </div>
                            
                            <div class="bg-[rgba(5,5,15,0.5)] p-4 rounded-lg">
                                <div class="text-purple-300 font-medium mb-2">🔬 Proses Kalkulasi:</div>
                                <div class="text-white font-mono">
                                    ${decimal1} ${selectedOperation} ${decimal2} = ${isNegative ? '-' : ''}${result} (Desimal)
                                </div>
                                <div class="text-gray-300 text-sm mt-2">
                                    Dikonversi ke ${getBaseName(resultBase)}: ${finalResult}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

            output.innerHTML = outputHTML;
            setTimeout(() => output.classList.add('show'), 50);
        }

        // Error display
        function showCalcError(message, description = '') {
            const output = document.getElementById('calcOutput');
            output.innerHTML = `
                <div class="result-cosmic p-8 rounded-2xl border-red-600/60 shadow-lg">
                    <div class="flex items-center gap-3 text-red-400 text-lg font-semibold mb-3">
                        <span>${message.split(' ')[0]}</span>
                        <span>${message.substring(message.indexOf(' ') + 1)}</span>
                    </div>
                    ${description ? `<p class="text-red-300/80">${description}</p>` : ''}
                </div>`;
            output.classList.add('show');
        }

        // Auto calculate functions
        function autoCalculate() {
            const num1 = document.getElementById('calcNum1').value.trim();
            const num2 = document.getElementById('calcNum2').value.trim();
            if (num1 && num2) {
                clearTimeout(realTimeTimeout);
                realTimeTimeout = setTimeout(calculateOperation, 300);
            }
        }

        function autoCalculateMulti() {
            const num1 = document.getElementById('calcNumMulti1').value.trim();
            const num2 = document.getElementById('calcNumMulti2').value.trim();
            if (num1 && num2) {
                clearTimeout(realTimeTimeout);
                realTimeTimeout = setTimeout(calculateMultiOperation, 300);
            }
        }

        // Converter functions
        function swapBases() {
            const fromBase = document.getElementById('fromBase');
            const toBase = document.getElementById('toBase');
            const temp = fromBase.value;
            fromBase.value = toBase.value;
            toBase.value = temp;
            if (document.getElementById('input').value.trim()) {
                konversi();
            }
        }

        function realTimeConvert() {
            if (realTimeEnabled) {
                clearTimeout(realTimeTimeout);
                if (document.getElementById('input').value.trim()) {
                    realTimeTimeout = setTimeout(konversi, 300);
                }
            }
        }

        function konversi() {
            const fromBase = parseInt(document.getElementById('fromBase').value);
            const toBase = parseInt(document.getElementById('toBase').value);
            let inputRaw = document.getElementById('input').value.trim();
            const output = document.getElementById('output');

            output.innerHTML = '';
            output.classList.remove('show');

            if (!inputRaw) {
                showError('🌠 Masukkan angka untuk memulai perjalanan', 'warning');
                return;
            }

            if (inputRaw.startsWith('-')) {
                inputRaw = inputRaw.slice(1);
                if (inputRaw.length === 0) {
                    showError('❌ Input tidak valid: hanya tanda minus tanpa angka');
                    return;
                }
            }

            if (!validateInput(inputRaw, fromBase)) {
                showError(`🚫 Input tidak valid untuk ${getBaseName(fromBase)}`, `Karakter yang diizinkan: ${getValidChars(fromBase)}`);
                return;
            }

            try {
                let desimal = parseInt(inputRaw, fromBase);
                if (isNaN(desimal)) throw `Angka tidak valid untuk basis ${fromBase}`;

                desimal = Math.abs(desimal);
                let hasil = desimal.toString(toBase).toUpperCase();

                showResult(hasil, inputRaw, fromBase, toBase, desimal);
                realTimeEnabled = true;
            } catch (e) {
                showError(`❌ Error: ${e}`);
            }
        }

        function showError(message, description = '') {
            const output = document.getElementById('output');
            output.innerHTML = `
                <div class="result-cosmic p-8 rounded-2xl border-red-600/60 shadow-lg">
                    <div class="flex items-center gap-3 text-red-400 text-lg font-semibold mb-3">
                        <span>${message.split(' ')[0]}</span>
                        <span>${message.substring(message.indexOf(' ') + 1)}</span>
                    </div>
                    ${description ? `<p class="text-red-300/80">${description}</p>` : ''}
                </div>`;
            output.classList.add('show');
        }

        function showResult(hasil, inputRaw, fromBase, toBase, desimal) {
            const output = document.getElementById('output');
            
            let outputHTML = `
                <div class="result-cosmic p-8 rounded-2xl shadow-lg">
                    <div class="flex items-center justify-between gap-3 text-green-400 text-xl font-semibold mb-6">
                        <div class="flex items-center gap-3">
                            <span>🌟</span>
                            <span>Perjalanan Berhasil!</span>
                        </div>
                        <button class="cosmic-input border border-purple-600 text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg px-4 py-2 text-sm transition-all duration-300" onclick="copyResult('${hasil}')" title="Salin hasil">
                            📋 Salin
                        </button>
                    </div>
                    
                    <div class="text-center mb-8">
                        <div class="inline-block font-mono text-4xl font-extrabold bg-gradient-to-br from-[#8a2be2] via-[#1e90ff] via-[#ff1493] via-[#00ff7f] to-[#8a2be2] bg-[length:400%_400%] bg-clip-text text-transparent p-6 rounded-xl border-2 border-purple-600/50 bg-[rgba(5,5,15,0.95)] animate-[cosmicGradient_6s_ease-in-out_infinite]">
                            ${hasil}
                        </div>
                    </div>`;

            if (fromBase === 10 && toBase !== 10) {
                outputHTML += createStepSection('🔬 Langkah-langkah Konversi:', generateSteps(desimal, toBase));
            } else if (fromBase !== 10 && toBase === 10) {
                outputHTML += createStepSection('🔬 Langkah-langkah Konversi:', generateFromBaseSteps(inputRaw, fromBase));
            } else if (fromBase !== 10 && toBase !== 10) {
                outputHTML += createStepSection(`🔬 Langkah 1: ${getBaseName(fromBase)} → Desimal`, generateFromBaseSteps(inputRaw, fromBase));
                outputHTML += createStepSection(`🔬 Langkah 2: Desimal → ${getBaseName(toBase)}`, generateSteps(desimal, toBase));
            }

            outputHTML += `
                <div class="mt-8 p-6 bg-[rgba(5,5,15,0.7)] backdrop-blur-md rounded-lg border-l-4 border-purple-600 shadow-md transition-all duration-300 hover:translate-x-1 hover:shadow-lg">
                    <h4 class="text-purple-400 font-semibold text-lg mb-4 flex items-center gap-2">🌌 Peta Perjalanan:</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div class="bg-[rgba(5,5,15,0.5)] p-4 rounded-lg">
                            <div class="text-purple-300 font-medium">🚀 Dari Planet:</div>
                            <div class="text-white font-mono text-lg">${inputRaw} <span class="text-purple-400">(${getBaseName(fromBase)})</span></div>
                        </div>
                        <div class="bg-[rgba(5,5,15,0.5)] p-4 rounded-lg">
                            <div class="text-purple-300 font-medium">🎯 Ke Planet:</div>
                            <div class="text-white font-mono text-lg">${hasil} <span class="text-purple-400">(${getBaseName(toBase)})</span></div>
                        </div>
                        <div class="bg-[rgba(5,5,15,0.5)] p-4 rounded-lg">
                            <div class="text-purple-300 font-medium">🌍 Stasiun Transit:</div>
                            <div class="text-white font-mono text-lg">${desimal} (Desimal)</div>
                        </div>
                        <div class="bg-[rgba(5,5,15,0.5)] p-4 rounded-lg">
                            <div class="text-purple-300 font-medium">🛸 Rute:</div>
                            <div class="text-white text-sm">${getBaseName(fromBase)} → ${getBaseName(toBase)}</div>
                        </div>
                    </div>
                </div>
            </div>`;

            output.innerHTML = outputHTML;
            setTimeout(() => output.classList.add('show'), 50);
        }

        // Helper functions
        function createStepSection(title, content) {
            return `
                <div class="mt-6 p-6 bg-[rgba(5,5,15,0.7)] backdrop-blur-md rounded-lg border-l-4 border-purple-600 shadow-md transition-all duration-300 hover:translate-x-1 hover:shadow-lg">
                    <h4 class="text-purple-400 font-semibold text-lg mb-4 flex items-center gap-2">${title}</h4>
                    <pre class="font-mono text-white/90 whitespace-pre-wrap text-sm leading-relaxed bg-[rgba(0,0,0,0.3)] p-4 rounded-lg overflow-x-auto">${content}</pre>
                </div>`;
        }

        function generateSteps(desimal, toBase) {
            if (desimal === 0) return `0 ÷ ${toBase} = 0 sisa 0\n→ 0`;

            let n = desimal;
            let proses = "";
            const digit = "0123456789ABCDEF";
            let hasilSementara = "";

            while (n > 0) {
                const sisa = n % toBase;
                const bagi = Math.floor(n / toBase);
                proses += `${n} ÷ ${toBase} = ${bagi} sisa ${digit[sisa]}\n`;
                hasilSementara = digit[sisa] + hasilSementara;
                n = bagi;
            }

            return proses + `\nHasil: ${hasilSementara} (${getBaseName(toBase)})`;
        }

        function generateFromBaseSteps(input, fromBase) {
            let result = "";
            let total = 0;
            const digit = "0123456789ABCDEF";

            for (let i = 0; i < input.length; i++) {
                const pos = input.length - 1 - i;
                const digitValue = digit.indexOf(input[i].toUpperCase());
                const placeValue = Math.pow(fromBase, pos);
                const contribution = digitValue * placeValue;
                total += contribution;
                result += `${input[i]} × ${fromBase}^${pos} = ${digitValue} × ${placeValue} = ${contribution}\n`;
            }

            result += `\nTotal: ${total} (Desimal)`;
            return result;
        }

        function copyResult(text) {
            navigator.clipboard.writeText(text).then(() => {
                const btn = event.target;
                const original = btn.innerHTML;
                btn.innerHTML = '✨ Disalin!';
                btn.classList.add('copy-success');
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.classList.remove('copy-success');
                }, 1500);
            }).catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                const btn = event.target;
                const original = btn.innerHTML;
                btn.innerHTML = '✨ Disalin!';
                setTimeout(() => btn.innerHTML = original, 1500);
            });
        }

        function getBaseName(base) {
            const names = {
                '2': 'Biner',
                '8': 'Oktal',
                '10': 'Desimal',
                '16': 'Heksadesimal'
            };
            return names[base] || `Base ${base}`;
        }

        function validateInput(input, base) {
            if (input.startsWith('-')) {
                input = input.slice(1);
                if (input.length === 0) return false;
            }
            const validChars = {
                2: '01',
                8: '01234567',
                10: '0123456789',
                16: '0123456789ABCDEF'
            };
            return input.split('').every(char => validChars[base].includes(char.toUpperCase()));
        }

        function getValidChars(base) {
            const chars = {
                2: '0, 1',
                8: '0-7',
                10: '0-9',
                16: '0-9, A-F'
            };
            return chars[base];
        }

        // Initialize everything
        window.onload = () => {
            initSpaceEffects();
            
            // Initialize converter
            if (document.getElementById('input')) {
                document.getElementById('input').focus();
            }
            
            // Initialize calculator
            selectOperation('+'); // Default operation
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    if (currentTab === 'converter') {
                        konversi();
                    } else {
                        if (currentInputMode === 'single') {
                            calculateOperation();
                        } else {
                            calculateMultiOperation();
                        }
                    }
                }
            });
        };
