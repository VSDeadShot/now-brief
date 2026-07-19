export async function fetchGithubActivity(username) {
  try {
    // Fetch up to 3 pages (300 events) to calculate longer streaks more accurately
    const [res1, res2, res3] = await Promise.all([
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100&page=1&t=${Date.now()}`),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100&page=2&t=${Date.now()}`),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100&page=3&t=${Date.now()}`)
    ]);
    
    let events = [];
    if (res1.ok) events.push(...(await res1.json()));
    if (res2.ok) events.push(...(await res2.json()));
    if (res3.ok) events.push(...(await res3.json()));

    if (events.length === 0) throw new Error('Failed to fetch GitHub events');
    
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-CA');
    
    // Group events by day (YYYY-MM-DD) local time
    const contributionDays = new Set();
    let todayContributions = 0;
    
    events.forEach(event => {
      const contributionTypes = ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent', 'PullRequestReviewEvent'];
      if (contributionTypes.includes(event.type)) {
        const date = new Date(event.created_at).toLocaleDateString('en-CA');
        contributionDays.add(date);

        if (date === todayStr) {
          if (event.type === 'PushEvent' && event.payload.commits) {
            todayContributions += event.payload.commits.length;
          } else {
            todayContributions += 1;
          }
        }
      }
    });

    // Calculate streak
    let currentStreak = 0;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('en-CA');

    const hasContributedToday = contributionDays.has(todayStr);
    
    // Start counting streak from today if contributed, else from yesterday
    let checkDate = new Date(today);
    if (!hasContributedToday) {
      if (contributionDays.has(yesterdayStr)) {
        checkDate = new Date(yesterday);
      } else {
        checkDate = null;
      }
    }

    if (checkDate) {
      while (true) {
        const dateStr = checkDate.toLocaleDateString('en-CA');
        if (contributionDays.has(dateStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Last 7 days activity graph
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      last7Days.push({
        date: d.toLocaleDateString('en-CA'),
        active: contributionDays.has(d.toLocaleDateString('en-CA'))
      });
    }

    return {
      streak: currentStreak,
      hasContributedToday,
      todayContributions,
      last7Days
    };

  } catch (error) {
    console.error("GitHub fetch error:", error);
    return null; 
  }
}
