// Client-side rule-based NLP Chaos Parser for unstructured text inputs (WhatsApp, email, verbal notes)

export function parseChaosText(text) {
  if (!text || typeof text !== 'string') return [];

  // Split into potential sentences or clauses
  const lines = text
    .split(/[\n;.]+|\b(?:also|and then|additionally|plus)\b/i)
    .map(l => l.trim())
    .filter(line => line.length > 3);

  const actions = [];
  const urgentKeywords = ['urgent', 'urgently', 'asap', 'critical', 'immediately', 'highest priority', 'p0'];
  const highKeywords = ['important', 'today', 'deadline', 'proposal', 'invoice', 'client', 'payment', 'p1'];
  
  const keywordsMap = [
    { keys: ['proposal', 'quotation', 'quote'], titlePrefix: 'Prepare Revised Proposal', category: 'sales' },
    { keys: ['invoice', 'payment', 'bill', 'finance'], titlePrefix: 'Check Pending Invoice', category: 'finance' },
    { keys: ['call', 'ring', 'phone', 'contact'], titlePrefix: 'Call Client:', category: 'communication' },
    { keys: ['email', 'mail', 'send'], titlePrefix: 'Send Email regarding', category: 'communication' },
    { keys: ['review', 'check', 'verify'], titlePrefix: 'Review Document:', category: 'review' },
    { keys: ['meeting', 'discussion', 'sync'], titlePrefix: 'Schedule Meeting:', category: 'operations' },
    { keys: ['report', 'stats', 'analytics'], titlePrefix: 'Compile Report:', category: 'analytics' },
    { keys: ['follow up', 'followup'], titlePrefix: 'Follow Up with Client:', category: 'communication' },
  ];

  lines.forEach((line, idx) => {
    const lower = line.toLowerCase();

    // Priority Detection
    let priority = 'medium';
    if (urgentKeywords.some(k => lower.includes(k))) priority = 'urgent';
    else if (highKeywords.some(k => lower.includes(k))) priority = 'high';

    // Title & Category Matching
    let titlePrefix = '';
    let category = 'general';
    for (const item of keywordsMap) {
      if (item.keys.some(k => lower.includes(k))) {
        titlePrefix = item.titlePrefix;
        category = item.category;
        break;
      }
    }

    // Due Date Extraction
    let dueDate = null;
    const now = new Date();
    if (lower.includes('today') || lower.includes('urgently') || lower.includes('asap')) {
      dueDate = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString();
    } else if (lower.includes('tomorrow')) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDate = tomorrow.toISOString();
    } else if (lower.includes('next week')) {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 5);
      dueDate = nextWeek.toISOString();
    }

    // Clean text
    let cleanText = line
      .replace(/^(please|can you|we need to|client called and|client wants|make sure to|remember to|also)\s+/i, '')
      .replace(/\s+(urgently|asap|today|tomorrow)$/i, '');

    cleanText = cleanText.charAt(0).toUpperCase() + cleanText.slice(1);

    const fullTitle = titlePrefix ? (cleanText.toLowerCase().includes(titlePrefix.toLowerCase()) ? cleanText : `${titlePrefix}: ${cleanText}`) : cleanText;

    if (fullTitle.length > 5) {
      actions.push({
        id: `chaos-action-${Date.now()}-${idx}`,
        title: fullTitle.substring(0, 80),
        description: `Extracted from raw input line: "${line}"`,
        priority,
        category,
        due_date: dueDate,
        selected: true
      });
    }
  });

  // Fallback single card if text was short
  if (actions.length === 0 && text.trim().length > 0) {
    actions.push({
      id: `chaos-action-${Date.now()}-0`,
      title: `Process Request: ${text.trim().substring(0, 60)}`,
      description: text,
      priority: 'high',
      category: 'general',
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      selected: true
    });
  }

  return actions;
}
