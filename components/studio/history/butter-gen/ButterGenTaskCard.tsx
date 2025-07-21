'use client';

import { Task, ButterGenDetails } from '@/types/task';
import { useState, useEffect } from 'react';
import { getTaskStatus } from '@/lib/api';
import {
  LoaderCircle,
  Sparkles,
  AlertTriangle,
  Image as ImageIcon,
  RefreshCw,
} from 'lucide-react';
import Image from 'next/image';
import StatusBadge from '../StatusBadge';

interface Props {
  task: Task & { actionType: 'BUTTER_GEN' };
  onClick: () => void;
}

export default function ButterGenTaskCard({
  task: initialTask,
  onClick,
}: Props) {
  const [task, setTask] = useState(initialTask);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFullTaskDetails = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await getTaskStatus(task.taskId);
      const data = res?.data;
      if (data) {
        setTask((prevTask) => ({
          ...prevTask,
          status: data.status,
          details: data.details as ButterGenDetails,
        }));
      }
    } catch (err) {
      console.error(`Failed to fetch details for task ${task.taskId}`, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!task.details) {
      fetchFullTaskDetails();
    }
  }, [task.details]);

  const { request, result } = task.details || {};

  const renderImageContent = () => {
    if (isLoading && task.status !== 'COMPLETED') {
      return <LoaderCircle size={32} className="animate-spin text-accent" />;
    }

    if (task.status === 'COMPLETED') {
      if (result?.imageUrl) {
        return (
          <Image
            src={result.imageUrl}
            alt={request?.prompt || 'Completed Image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        );
      }
      return <LoaderCircle size={32} className="animate-spin text-accent" />;
    }

    if (task.status === 'FAILED') {
      return <AlertTriangle size={32} className="text-red-500" />;
    }

    if (request?.sourceImageUrl) {
      return (
        <Image
          src={request.sourceImageUrl}
          alt="Source image"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover opacity-30"
        />
      );
    }

    return <ImageIcon size={32} className="text-slate-600" />;
  };

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[.02] shadow-lg transition-all hover:border-accent/50 hover:shadow-accent/10"
    >
      <div className="relative flex aspect-square w-full items-center justify-center bg-black/20">
        {renderImageContent()}
        {(task.status === 'PENDING' || task.status === 'PROCESSING') && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <LoaderCircle size={32} className="animate-spin text-accent" />
          </div>
        )}
      </div>
      <div className="flex flex-grow flex-col p-4">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-accent">
            <Sparkles size={16} />
            <span>ButterGen</span>
          </div>
          <StatusBadge status={task.status} />
        </div>

        <p
          className="mb-3 line-clamp-3 flex-grow text-sm text-slate-300"
          title={request?.prompt}
        >
          {request?.prompt || 'Loading details...'}
        </p>

        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-500">
          <span>Task ID: {task.taskId}</span>

          {(task.status === 'PROCESSING' || task.status === 'PENDING') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                fetchFullTaskDetails();
              }}
              disabled={isLoading}
              className="hover:text-accent disabled:text-slate-600"
            >
              <RefreshCw
                size={14}
                className={isLoading ? 'animate-spin' : ''}
              />
            </button>
          )}
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
