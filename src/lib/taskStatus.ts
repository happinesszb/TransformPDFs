// 使用内存存储任务状态
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
  console.log(`更新任务状态 - TaskID: ${taskId}, Status: ${status.status}`);
  taskStatus.set(taskId, status);
  if (status.status === 'completed' && status.result) {
    // 保持文件数据，并设置自动清理
    setTimeout(() => {
      console.log(`清理任务 - TaskID: ${taskId}`);
      taskStatus.delete(taskId);
      taskFiles.delete(taskId);
    }, 20 * 60 * 1000); // 20分钟后清理
  }
}

export function getTaskStatus(taskId: string) {
  return taskStatus.get(taskId);
}

export function setTaskFile(taskId: string, file: Blob) {
  console.log(`存储转换文件 - TaskID: ${taskId}`);
  taskFiles.set(taskId, file);
}

export function getTaskFile(taskId: string): Blob | undefined {
  return taskFiles.get(taskId);
} 