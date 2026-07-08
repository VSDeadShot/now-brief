import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
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
      className="w-full rounded-[24px] bg-[#1E1E1E] border border-[#2C2C2C] p-4 flex flex-col gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
    >
      <div className="flex items-center gap-3 text-[#A0A0A0]">
        <CheckCircle2 strokeWidth={2} className="w-[18px] h-[18px] text-blue-500" />
        <h2 className="font-semibold text-sm text-[#F5F5F5]">OmniTask</h2>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col gap-3">
          <div className="h-4 bg-[#2C2C2C] rounded w-3/4"></div>
          <div className="h-4 bg-[#2C2C2C] rounded w-1/2"></div>
        </div>
      ) : data ? (
        <div className="flex flex-col gap-3">
          {data.tasks && data.tasks.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {data.tasks.map((task, idx) => (
                <li key={task.id || idx} className="flex flex-col gap-1">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                      task.priority === 'high' ? 'bg-blue-500' : 
                      task.priority === 'low' ? 'bg-[#A0A0A0]' : 
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[#F5F5F5] font-medium text-xs truncate">{task.title || task.name || task}</span>
                      
                      {/* Sub-info row: Project, Priority, Due Date */}
                      {(task.project || task.priority || task.dueDate) && (
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[#A0A0A0] font-medium">
                          {task.project && task.project !== 'General' && (
                            <span className="bg-[#2C2C2C] px-1.5 py-0.5 rounded-md text-[#A0A0A0] truncate max-w-[100px]">
                              {task.project}
                            </span>
                          )}
                          
                          {task.priority && task.priority !== 'medium' && (
                            <span className="capitalize">{task.priority} Priority</span>
                          )}

                          {task.dueDate && (
                            <span className="text-[#A0A0A0] flex items-center gap-1">
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
            <div className="text-[#A0A0A0] font-medium flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              Inbox zero! No tasks due today.
            </div>
          )}
        </div>
      ) : (
        <div className="text-[#A0A0A0] text-xs font-medium">
          OmniTask local API is not running. Start the server to see tasks.
        </div>
      )}
    </motion.div>
  );
}
