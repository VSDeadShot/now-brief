export async function fetchOmniTasks() {
  try {
    const res = await fetch('http://localhost:3001/api/tasks');
    
    if (!res.ok) {
      throw new Error('Failed to fetch from OmniTask');
    }
    
    const allTasks = await res.json();
    
    // Filter for pending tasks
    const pendingTasks = allTasks.filter(t => t.status !== 'completed');
    
    // Let's filter for those due today or earlier, or without a due date
    const todayStr = new Date().toISOString().split('T')[0];
    const dueToday = pendingTasks.filter(t => {
      if (!t.dueDate) return true; // Show tasks with no specific due date
      const taskDate = t.dueDate.split('T')[0];
      return taskDate <= todayStr;
    });

    return {
      tasks: dueToday
    };
  } catch (error) {
    console.error("OmniTask fetch error (is it running?):", error);
    return null; 
  }
}
