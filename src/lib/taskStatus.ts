//  
const taskStatus = new Map<string, {
  status: 'pending' | 'processing' | 'completed' | 'failed',
  result?: {
    fileName: string,
    contentType: string
  },
  error?: string
}>();

const taskFiles = new Map<string, Blob>();

export function updateTaskStatus(taskId: string, status: {
  status: 'pending' | 'processing' | 'completed' | 'failed',
  result?: {
    fileName: string,
    contentType: string
  },
  error?: string
}) {
  console.log(`Task status - TaskID: ${taskId}, Status: ${status.status}`);
  taskStatus.set(taskId, status);
  if (status.status === 'completed' && status.result) {
    //  
    setTimeout(() => {
      console.log(`clean task - TaskID: ${taskId}`);
      taskStatus.delete(taskId);
      taskFiles.delete(taskId);
    }, 20 * 60 * 1000); //  
  }
}

export function getTaskStatus(taskId: string) {
  return taskStatus.get(taskId);
}

export function setTaskFile(taskId: string, file: Blob) {
  console.log(`save file - TaskID: ${taskId}`);
  taskFiles.set(taskId, file);
}

export function getTaskFile(taskId: string): Blob | undefined {
  return taskFiles.get(taskId);
} 