export async function fetchOmniTasks() {
  try {
    const res = await fetch('http://localhost:3001/api/tasks');
    
    if (!res.ok) {
      throw new Error('Failed to fetch from OmniTask');
    }
    
    const allTasks = await res.json();
    
    // Filter for pending tasks
    const pendingTasks = allTasks.filter(t => t.status !== 'completed');
    
    // Let's sort the pending tasks by due date (tasks without a due date go to the bottom)
    const sortedTasks = pendingTasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    return {
      tasks: sortedTasks
    };
  } catch (error) {
    console.error("OmniTask fetch error (is it running?):", error);
    return null; 
  }
}
