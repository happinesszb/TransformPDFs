import { NextRequest, NextResponse } from 'next/server';
import { getTaskStatus } from '@/lib/taskStatus';

export async function GET(request: NextRequest) {
  const taskId = request.nextUrl.searchParams.get('taskId');
  
  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  const status = getTaskStatus(taskId);
  if (!status) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json(status);
} 