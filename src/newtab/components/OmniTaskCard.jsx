import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchOmniTasks } from '../../lib/omnitask';
import { getCache, setCache } from '../../lib/cache';

export default function OmniTaskCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const cached = await getCache('omnitask_data');
      if (cached) {
        setData(cached);
        setLoading(false);
      }

      const freshData = await fetchOmniTasks();
      if (freshData) {
        setData(freshData);
        setCache('omnitask_data', freshData);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="w-full rounded-[24px] bg-white/5 backdrop-blur-2xl border border-white/10 p-4 flex flex-col gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
    >
      <div className="flex items-center gap-3 text-zinc-300">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 11.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
        <h2 className="font-bold text-lg text-white/90">OmniTask</h2>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-3">
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      ) : data ? (
        <div className="flex flex-col gap-3">
          {data.tasks && data.tasks.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {data.tasks.map((task, idx) => (
                <li key={task.id || idx} className="flex flex-col gap-1">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                      task.priority === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 
                      task.priority === 'low' ? 'bg-zinc-400 shadow-[0_0_8px_rgba(161,161,170,0.8)]' : 
                      'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]'
                    }`}></div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-white font-medium text-base truncate">{task.title || task.name || task}</span>
                      
                      {/* Sub-info row: Project, Priority, Due Date */}
                      {(task.project || task.priority || task.dueDate) && (
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400 font-medium">
                          {task.project && task.project !== 'General' && (
                            <span className="bg-white/10 px-1.5 py-0.5 rounded-md text-zinc-300 truncate max-w-[100px]">
                              {task.project}
                            </span>
                          )}
                          
                          {task.priority && task.priority !== 'medium' && (
                            <span className="capitalize">{task.priority} Priority</span>
                          )}

                          {task.dueDate && (
                            <span className="text-zinc-500 flex items-center gap-1">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                              </svg>
                              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-zinc-300 font-medium flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
              Inbox zero! No tasks due today.
            </div>
          )}
        </div>
      ) : (
        <div className="text-zinc-500 text-sm font-medium">
          OmniTask local API is not running. Start the server to see tasks.
        </div>
      )}
    </motion.div>
  );
}
