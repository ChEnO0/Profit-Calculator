document.addEventListener('DOMContentLoaded', () => {
    // DOM元素引用
    const costInput = document.getElementById('cost');
    const currentInput = document.getElementById('current');
    const percentInput = document.getElementById('percent');
    const resultEl = document.getElementById('result');
    const calculateButton = document.getElementById('calculateButton');
    const resetButton = document.getElementById('resetButton');
    const languageSelect = document.getElementById('languageSelect');
    const themeToggle = document.getElementById('themeToggle');
    const currentYear = document.getElementById('currentYear');
    const title = document.getElementById('title');
    const costLabel = document.getElementById('costLabel');
    const currentLabel = document.getElementById('currentLabel');
    const percentLabel = document.getElementById('percentLabel');

    // 状态变量
    let isChinese = languageSelect && languageSelect.value === 'zh';
    let isDarkTheme = false;

    // 初始化
    function init() {
        setCurrentYear();
        loadThemePreference();
        switchLanguage();
        attachEventListeners();
        setupInputValidation();
        updateCalculateButtonState();
    }

    // 设置当前年份
    function setCurrentYear() {
        currentYear.textContent = new Date().getFullYear();
    }

    // 加载主题偏好
    function loadThemePreference() {
        const savedTheme = localStorage.getItem('profitCalculatorTheme');
        if (savedTheme === 'dark') {
            enableDarkTheme();
        } else if (savedTheme === 'light') {
            enableLightTheme();
        } else {
            // 默认跟随系统
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                enableDarkTheme();
            }
        }
    }

    // 启用暗色主题
    function enableDarkTheme() {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light';
        isDarkTheme = true;
        localStorage.setItem('profitCalculatorTheme', 'dark');
    }

    // 启用亮色主题
    function enableLightTheme() {
        document.body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark';
        isDarkTheme = false;
        localStorage.setItem('profitCalculatorTheme', 'light');
    }

    // 附加事件监听器
    function attachEventListeners() {
        calculateButton.addEventListener('click', calculate);
        resetButton.addEventListener('click', resetInputs);
        languageSelect.addEventListener('change', switchLanguage);
        themeToggle.addEventListener('click', toggleTheme);
        
        // 输入变化时更新计算按钮状态
        [costInput, currentInput, percentInput].forEach(input => {
            input.addEventListener('input', updateCalculateButtonState);
        });
    }

    // 设置输入验证
    function setupInputValidation() {
        [costInput, currentInput, percentInput].forEach(input => {
            input.addEventListener('input', function() {
                // 只允许数字、小数点和负号
                let value = this.value;
                value = value.replace(/[^0-9.-]/g, '');
                
                // 确保只有一个负号在开头
                if (value.includes('-')) {
                    const firstIndex = value.indexOf('-');
                    value = '-' + value.replace(/-/g, '').replace(/\./g, '');
                    // 保留小数点
                    if (this.value.includes('.')) {
                        const parts = this.value.split('.');
                        if (parts.length > 1) {
                            value = value.split('.')[0] + '.' + parts[1].replace(/[^0-9]/g, '');
                        }
                    }
                }
                
                // 确保只有一个小数点
                const dotCount = (value.match(/\./g) || []).length;
                if (dotCount > 1) {
                    const parts = value.split('.');
                    value = parts[0] + '.' + parts.slice(1).join('');
                }
                
                this.value = value;
            });
        });
    }

    // 更新计算按钮状态
    function updateCalculateButtonState() {
        const validCount = countValidInputs();
        if (calculateButton) {
            calculateButton.disabled = validCount < 2;
            calculateButton.style.opacity = validCount < 2 ? '0.6' : '1';
            calculateButton.style.cursor = validCount < 2 ? 'not-allowed' : 'pointer';
        }
    }

    // 计算有效输入数量
    function countValidInputs() {
        const cost = costInput ? parseFloat(costInput.value) : NaN;
        const current = currentInput ? parseFloat(currentInput.value) : NaN;
        const percent = percentInput ? parseFloat(percentInput.value) : NaN;
        
        let count = 0;
        if (!isNaN(cost) && cost !== 0) count++;
        if (!isNaN(current) && current !== 0) count++;
        if (!isNaN(percent)) count++;
        return count;
    }

    // 主计算函数
    function calculate() {
        const cost = costInput ? parseFloat(costInput.value) : NaN;
        const current = currentInput ? parseFloat(currentInput.value) : NaN;
        const percent = percentInput ? parseFloat(percentInput.value) : NaN;

        const hasCost = !isNaN(cost) && cost !== 0;
        const hasCurrent = !isNaN(current) && current !== 0;
        const hasPercent = !isNaN(percent);

        // 验证输入
        if ((hasCost && hasCurrent && hasPercent) || (!hasCost && !hasCurrent && !hasPercent)) {
            if (resultEl) resultEl.innerText = isChinese ? "请输入任意两个数值来计算。" : "Please enter any two values to calculate.";
            return;
        }

        let result = "";
        let calculatedPercent = 0;
        let calculatedCurrent = 0;
        let calculatedCost = 0;

        if (hasCost && hasCurrent) {
            calculatedPercent = ((current - cost) / cost) * 100;
            result = isChinese ? 
                `涨跌幅为 ${calculatedPercent.toFixed(2)}%` : 
                `Change % is ${calculatedPercent.toFixed(2)}%`;
            percentInput.value = calculatedPercent.toFixed(2);
            calculatedCost = cost;
            calculatedCurrent = current;
        } else if (hasCost && hasPercent) {
            calculatedCurrent = cost * (1 + percent / 100);
            result = isChinese ? 
                `现价为 ${formatNumber(calculatedCurrent)}` : 
                `Current Price is ${formatNumber(calculatedCurrent)}`;
            currentInput.value = calculatedCurrent.toFixed(4);
            calculatedCost = cost;
            calculatedPercent = percent;
        } else if (hasCurrent && hasPercent) {
            calculatedCost = current / (1 + percent / 100);
            result = isChinese ? 
                `成本价为 ${formatNumber(calculatedCost)}` : 
                `Cost is ${formatNumber(calculatedCost)}`;
            costInput.value = calculatedCost.toFixed(4);
            calculatedCurrent = current;
            calculatedPercent = percent;
        } else {
            result = isChinese ? "请输入任意两个值。" : "Please enter any two values.";
            if (resultEl) resultEl.innerText = result;
            return;
        }

        if (resultEl) resultEl.innerText = result;
    }

    // 格式化数字
    function formatNumber(value) {
        return value.toFixed(2);
    }

    // 重置输入
    function resetInputs() {
        if (costInput) costInput.value = '';
        if (currentInput) currentInput.value = '';
        if (percentInput) percentInput.value = '';
        if (resultEl) resultEl.innerText = '';
        updateCalculateButtonState();
    }

    // 切换语言
    function switchLanguage() {
        isChinese = languageSelect?.value === 'zh';
        
        if (isChinese) {
            if (title) title.innerText = "利润计算器";
            if (costLabel) costLabel.innerText = "成本：";
            if (currentLabel) currentLabel.innerText = "现价：";
            if (percentLabel) percentLabel.innerText = "涨跌幅%：";
            if (calculateButton) calculateButton.innerText = "计算";
            if (resetButton) resetButton.innerText = "重置";
            if (costInput) costInput.placeholder = "输入成本";
            if (currentInput) currentInput.placeholder = "输入现价";
            if (percentInput) percentInput.placeholder = "输入涨跌幅%";
            if (themeToggle) {
                themeToggle.innerHTML = isDarkTheme ? 
                    '<i class="fas fa-sun"></i> 浅色' : 
                    '<i class="fas fa-moon"></i> 深色';
            }
        } else {
            if (title) title.innerText = "Profit Calculator";
            if (costLabel) costLabel.innerText = "Cost:";
            if (currentLabel) currentLabel.innerText = "Current Price:";
            if (percentLabel) percentLabel.innerText = "Change %:";
            if (calculateButton) calculateButton.innerText = "Calculate";
            if (resetButton) resetButton.innerText = "Reset";
            if (costInput) costInput.placeholder = "Enter cost";
            if (currentInput) currentInput.placeholder = "Enter current price";
            if (percentInput) percentInput.placeholder = "Enter change percentage %";
            if (themeToggle) {
                themeToggle.innerHTML = isDarkTheme ? 
                    '<i class="fas fa-sun"></i> Light' : 
                    '<i class="fas fa-moon"></i> Dark';
            }
        }
    }

    // 切换主题
    function toggleTheme() {
        if (isDarkTheme) {
            enableLightTheme();
        } else {
            enableDarkTheme();
        }
        switchLanguage();
    }

    // 初始化应用
    init();
});