import { NextRequest, NextResponse } from 'next/server';
import { getTaskStatus, getTaskFile } from '@/lib/taskStatus';

export async function GET(request: NextRequest) {
  const taskId = request.nextUrl.searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  const status = getTaskStatus(taskId);
  if (!status || status.status !== 'completed') {
    return NextResponse.json({ error: 'Task not completed or not found' }, { status: 404 });
  }

  const file = getTaskFile(taskId);
  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const { fileName, contentType } = status.result!;

  return new NextResponse(file, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    },
  });
}

export const config = {
  api: {
    responseLimit: false, // 取消默认的响应体大小限制
  },
}; 