// Silent Risk Detector algorithms
// Identifies at-risk operational items based on due date proximity, priority, and activity latency

export function detectRiskyTasks(tasks = []) {
  const active = tasks.filter(t => t.status !== 'completed');
  const now = new Date();
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const riskyItems = [];

  active.forEach(task => {
    let isRisk = false;
    let riskLevel = 'MEDIUM'; // LOW, MEDIUM, HIGH, CRITICAL
    let riskReason = '';

    const dueDate = task.due_date ? new Date(task.due_date) : null;

    // 1. Overdue Detection
    if (dueDate && dueDate < now) {
      isRisk = true;
      riskLevel = 'CRITICAL';
      riskReason = `Deadline passed (${dueDate.toLocaleDateString()}) - Overdue action required immediately.`;
    }
    // 2. High Priority + Approaching Deadline (< 24 hours)
    else if ((task.priority === 'urgent' || task.priority === 'high') && dueDate && dueDate <= next24Hours) {
      isRisk = true;
      riskLevel = 'HIGH';
      riskReason = `HIGH PRIORITY + DEADLINE APPROACHING (Due within ${Math.max(1, Math.round((dueDate - now) / 3600000))} hours).`;
    }
    // 3. Urgent priority unstarted (captured state)
    else if (task.priority === 'urgent' && task.status === 'captured') {
      isRisk = true;
      riskLevel = 'HIGH';
      riskReason = `URGENT priority task has not been started yet.`;
    }
    // 4. Stale in-progress task (> 48 hours without update)
    else if (task.status === 'in_progress') {
      const updatedAt = task.updated_at ? new Date(task.updated_at) : (task.created_at ? new Date(task.created_at) : null);
      if (updatedAt && (now - updatedAt) > 48 * 60 * 60 * 1000) {
        isRisk = true;
        riskLevel = 'MEDIUM';
        riskReason = `Stalled in progress for over 48 hours.`;
      }
    }

    if (isRisk) {
      riskyItems.push({
        task,
        riskLevel,
        riskReason
      });
    }
  });

  // Sort critical first
  const levelWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  return riskyItems.sort((a, b) => levelWeight[b.riskLevel] - levelWeight[a.riskLevel]);
}
