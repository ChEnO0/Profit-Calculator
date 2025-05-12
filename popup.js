document.addEventListener('DOMContentLoaded', () => {
    const costInput = document.getElementById('cost');
    const currentInput = document.getElementById('current');
    const percentInput = document.getElementById('percent');
    const resultEl = document.getElementById('result');
    const calculateButton = document.getElementById('calculateButton');
    const resetButton = document.getElementById('resetButton');
    const languageSelect = document.getElementById('languageSelect');
    const title = document.getElementById('title');
    const costLabel = document.getElementById('costLabel');
    const currentLabel = document.getElementById('currentLabel');
    const percentLabel = document.getElementById('percentLabel');
  
    let isChinese = languageSelect.value === 'zh';
  
    function calculate() {
      const cost = parseFloat(costInput.value);
      const current = parseFloat(currentInput.value);
      const percent = parseFloat(percentInput.value);
  
      const hasCost = !isNaN(cost);
      const hasCurrent = !isNaN(current);
      const hasPercent = !isNaN(percent);
  
      if ((hasCost && hasCurrent && hasPercent) || (!hasCost && !hasCurrent && !hasPercent)) {
        resultEl.innerText = isChinese ? "请输入任意两个数值来计算。" : "Please enter any two values to calculate.";
        return;
      }
  
      let result = "";
  
      if (hasCost && hasCurrent) {
        const p = ((current - cost) / cost) * 100;
        result = isChinese ? `涨跌幅为 ${p.toFixed(2)}%` : `Change % is ${p.toFixed(2)}%`;
        percentInput.value = p.toFixed(2); // 同时更新输入框
      } else if (hasCost && hasPercent) {
        const c = cost * (1 + percent / 100);
        result = isChinese ? `现价为 ${c.toFixed(4)}` : `Current Price is ${c.toFixed(4)}`;
        currentInput.value = c.toFixed(4); // 同时更新输入框
      } else if (hasCurrent && hasPercent) {
        const c = current / (1 + percent / 100);
        result = isChinese ? `成本价为 ${c.toFixed(4)}` : `Cost is ${c.toFixed(4)}`;
        costInput.value = c.toFixed(4); // 同时更新输入框
      } else {
        result = isChinese ? "请输入任意两个值。" : "Please enter any two values.";
      }
  
      resultEl.innerText = result;
    }
  
    function switchLanguage() {
      isChinese = languageSelect.value === 'zh';
      if (isChinese) {
        title.innerText = "利润计算器";
        costLabel.innerText = "成本：";
        currentLabel.innerText = "现价：";
        percentLabel.innerText = "涨跌幅：";
        calculateButton.innerText = "计算";
        resetButton.innerText = "刷新";
      } else {
        title.innerText = "Profit Calculator";
        costLabel.innerText = "Cost:";
        currentLabel.innerText = "Current Price:";
        percentLabel.innerText = "Change %:";
        calculateButton.innerText = "Calculate";
        resetButton.innerText = "Refresh";
      }
    }
  
    // 为计算按钮添加事件监听器
    calculateButton.addEventListener('click', calculate);
  
    // 为刷新按钮添加事件监听器
    resetButton.addEventListener('click', () => {
      costInput.value = '';
      currentInput.value = '';
      percentInput.value = '';
      resultEl.innerText = '';
    });
  
    // 为语言选择下拉框添加事件监听器
    languageSelect.addEventListener('change', switchLanguage);
  
    // 初始化语言状态
    switchLanguage();
  });