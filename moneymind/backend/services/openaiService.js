const OpenAI = require('openai');

let client = null;
if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const generateInsights = async (metrics, personality) => {
  if (!client) return getDefaultInsights(personality);

  const prompt = `
You are a financial advisor AI. Analyze this Pakistani user's spending data and provide 3 concise, actionable financial insights.
All amounts are in Pakistani Rupees (PKR).

Metrics:
- Savings Rate: ${(metrics.savingsRate * 100).toFixed(1)}%
- Impulse Spending Ratio: ${(metrics.impulseRatio * 100).toFixed(1)}%
- Budget Adherence: ${(metrics.budgetAdherence * 100).toFixed(1)}%
- Consistency Score: ${(metrics.consistencyScore * 100).toFixed(1)}%
- Financial Personality: ${personality}
- Total Income: Rs. ${metrics.income.toLocaleString()}
- Total Expenses: Rs. ${metrics.totalExp.toLocaleString()}

Return ONLY a valid JSON object: { "insights": [{ "type": "positive|warning|suggestion", "title": "string (max 8 words)", "message": "string (max 30 words)" }] }
Be specific, data-driven, and relevant to Pakistani financial context.
`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 500,
    });
    const parsed = JSON.parse(response.choices[0].message.content);
    return parsed.insights || getDefaultInsights(personality);
  } catch {
    return getDefaultInsights(personality);
  }
};

const getDefaultInsights = (personality) => {
  const map = {
    'Saver': [
      { type: 'positive',    title: 'Exceptional savings discipline',    message: 'Your savings rate exceeds 35%. Consider investing surplus in Pakistan Investment Bonds or mutual funds for better returns.' },
      { type: 'suggestion',  title: 'Diversify your savings',            message: 'Move a portion of savings to a high-yield savings account or government securities to beat inflation.' },
      { type: 'positive',    title: 'Low impulse spending',              message: 'Your impulse purchase ratio is well below average. This reflects strong financial self-control.' },
    ],
    'Balanced Spender': [
      { type: 'positive',    title: 'Good financial equilibrium',        message: 'You balance income and expenses effectively. Small reductions in dining spend could lift your score further.' },
      { type: 'warning',     title: 'Watch weekend spending spikes',     message: 'Weekend transactions show elevated impulse purchases. Setting a weekly cash allowance may help control this.' },
      { type: 'suggestion',  title: 'Build a 3-month emergency fund',    message: 'At your current savings rate, you can achieve a Rs. 150,000 emergency fund within 4-5 months.' },
    ],
    'Impulsive Spender': [
      { type: 'warning',     title: 'High impulse purchase ratio',       message: 'Over 45% of your spending is in discretionary categories. Try the 24-hour rule before non-essential purchases.' },
      { type: 'suggestion',  title: 'Create category-wise budgets',      message: 'Assigning monthly limits to shopping and dining categories can reduce overspend by up to 30%.' },
      { type: 'suggestion',  title: 'Automate your savings',             message: 'Set up an automatic transfer on salary day to a separate savings account before spending begins.' },
    ],
    'Risk Taker': [
      { type: 'warning',     title: 'High spending volatility detected', message: 'Your week-to-week spending varies significantly. This makes financial forecasting and planning difficult.' },
      { type: 'suggestion',  title: 'Smooth out irregular expenses',     message: 'Identify irregular large purchases and plan for them in advance to reduce monthly cash flow shocks.' },
      { type: 'positive',    title: 'Income diversification noted',      message: 'Your income sources appear varied. Ensure each stream is tracked separately for accurate tax and planning purposes.' },
    ],
  };
  return map[personality] || map['Balanced Spender'];
};

module.exports = { generateInsights };
