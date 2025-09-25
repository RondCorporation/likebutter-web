'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Trash2,
  ChevronDown,
  X,
  Music,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Download,
} from 'lucide-react';
import { useTaskArchive } from '@/hooks/useTaskArchive';
import TaskDetailsModal from '@/components/studio/archive/TaskDetailsModal';
import DeleteConfirmModal from '@/components/studio/archive/DeleteConfirmModal';
import SwipeableArchiveCard from '@/components/studio/archive/SwipeableArchiveCard';
import {
  deleteTask,
  deleteBatchTasks,
  BatchDeleteResponse,
} from '@/lib/apis/task.api';
import { Task } from '@/types/task';
import { downloadFile } from '@/app/_utils/download';

interface DropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  placeholder: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
}

function Dropdown({
  isOpen,
  onToggle,
  placeholder,
  options,
  onSelect,
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>(
    'bottom'
  );

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-[#25282c] border border-[#4a4a4b] text-white rounded-lg hover:border-[#5a5a5b] transition-colors text-sm"
      >
        <span>{placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 bg-[#25282c] border border-[#4a4a4b] rounded-lg py-1 min-w-[200px] z-10 ${
            dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                onToggle();
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-[#4a4a4b] transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ArchiveTaskCard({
  task,
  onClick,
  onDelete,
  isSelectionMode,
  isSelected,
  onToggleSelect,
  onDownload,
}: {
  task: Task;
  onClick: () => void;
  onDelete: (task: Task) => void;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: (taskId: number) => void;
  onDownload: (task: Task) => void;
}) {
  const { t } = useTranslation(['studio', 'common']);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return t('studio:archive.dateFormat', {
      year,
      month: month.toString().padStart(2, '0'),
      day: day.toString().padStart(2, '0'),
      hour: hour.toString().padStart(2, '0'),
      minute: minute.toString().padStart(2, '0')
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showMobileMenu]);

  const renderTaskPreview = (task: Task) => {
    const { status, actionType } = task;

    if (status === 'FAILED') {
      return (
        <div className="w-full h-full flex items-center justify-center text-red-400">
          <div className="text-center">
            <X className="w-8 h-8 mx-auto mb-2" />
            <div className="text-sm font-medium">{t('studio:archive.processingFailed')}</div>
          </div>
        </div>
      );
    }

    if (status === 'PENDING') {
      return (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-sm font-medium">{t('studio:archive.generating')}</div>
          </div>
        </div>
      );
    }

    if (status === 'PROCESSING') {
      return (
        <div className="w-full h-full flex items-center justify-center text-yellow-400">
          <div className="text-center">
            <div className="text-sm font-medium">{t('studio:archive.generating')}</div>
          </div>
        </div>
      );
    }

    if (status === 'COMPLETED' && task.details?.result) {
      let imageUrl: string | null = null;

      switch (actionType) {
        case 'DIGITAL_GOODS':
        case 'DIGITAL_GOODS_EDIT':
          imageUrl = task.details.result.imageUrl || null;
          break;
        case 'FANMEETING_STUDIO':
        case 'FANMEETING_STUDIO_EDIT':
          imageUrl = task.details.result.imageUrl || null;
          break;
        case 'STYLIST':
        case 'STYLIST_EDIT':
          imageUrl = task.details.result.imageUrl || null;
          break;
        case 'VIRTUAL_CASTING':
        case 'VIRTUAL_CASTING_EDIT':
          imageUrl = task.details.result.imageUrl || null;
          break;
        case 'BUTTER_COVER':
          return (
            <div className="w-full h-full flex items-center justify-center text-green-400">
              <div className="text-center">
                <Music className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm font-medium">{t('studio:archive.audioGenComplete')}</div>
              </div>
            </div>
          );
        default:
          break;
      }

      if (imageUrl) {
        return (
          <img
            src={imageUrl}
            alt={getActionTypeLabel(actionType)}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const failedText = t('studio:archive.imageLoadFailed');
              const actionLabel = getActionTypeLabel(actionType);
              e.currentTarget.parentElement!.innerHTML = `
                <div class="w-full h-full flex items-center justify-center text-gray-400">
                  <div class="text-center">
                    <div class="text-sm font-medium">${failedText}</div>
                    <div class="text-xs mt-1">${actionLabel}</div>
                  </div>
                </div>
              `;
            }}
          />
        );
      } else {
        return (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-sm font-medium">
                {t('studio:archive.imageLoadFailed')}
              </div>
              <div className="text-xs mt-1">
                {getActionTypeLabel(actionType)}
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="text-sm font-medium">
            {getActionTypeLabel(task.actionType)}
          </div>
          <div className="text-xs mt-1">Task #{task.taskId}</div>
        </div>
      </div>
    );
  };

  const getActionTypeLabel = (actionType: string) => {
    const labels: { [key: string]: string } = {
      DIGITAL_GOODS: t('studio:tools.digitalGoods.title'),
      BUTTER_COVER: t('studio:tools.butterCoverTool.title'),
      FANMEETING_STUDIO: t('studio:tools.fanmeetingStudio.title'),
      STYLIST: t('studio:tools.stylist.title'),
      VIRTUAL_CASTING: t('studio:tools.virtualCasting.title'),
      DIGITAL_GOODS_EDIT: t('studio:archive.taskTypes.digitalGoodsEdit'),
      FANMEETING_STUDIO_EDIT: t('studio:archive.taskTypes.fanmeetingStudioEdit'),
      STYLIST_EDIT: t('studio:archive.taskTypes.stylistEdit'),
      VIRTUAL_CASTING_EDIT: t('studio:archive.taskTypes.virtualCastingEdit'),
    };
    return labels[actionType] || actionType;
  };

  const cardContent = (
    <div className="flex flex-col items-center gap-3 md:gap-4 group">
      {/* Card Preview */}
      <div className="relative w-full h-[200px] md:h-[165px] bg-[#4a4a4b] rounded-xl md:rounded-2xl overflow-hidden transition-transform md:group-hover:scale-105">
        <div
          className="w-full h-full cursor-pointer"
          onClick={
            isSelectionMode
              ? (e) => {
                  e.stopPropagation();
                  onToggleSelect(task.taskId);
                }
              : onClick
          }
        >
          {renderTaskPreview(task)}
        </div>

        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="absolute top-3 left-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect(task.taskId);
              }}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-yellow-400 border-yellow-400'
                  : 'bg-black/50 border-white/50 hover:border-white'
              }`}
            >
              {isSelected && (
                <svg
                  className="w-4 h-4 text-black"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Action Type badge */}
        <div className="absolute top-3 right-3">
          <div
            className={`px-2 py-1 text-xs font-medium rounded ${
              task.isEditTask
                ? 'bg-blue-500 text-white'
                : 'bg-[#e8fa07] text-[#292c31]'
            }`}
          >
            {getActionTypeLabel(task.actionType)}
            {task.editSequence && task.editSequence > 1 && (
              <span className="ml-1">#{task.editSequence}</span>
            )}
          </div>
        </div>

        {/* Download button for completed tasks */}
        {task.status === 'COMPLETED' && !isSelectionMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(task);
            }}
            className="absolute bottom-3 right-3 w-8 h-8 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 backdrop-blur-sm"
            title={t('studio:archive.download')}
          >
            <Download className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Card Info */}
      <div className="w-full text-center">
        <p className="text-[#a8a8aa] text-sm md:text-sm">
          {formatDate(task.createdAt)}
        </p>
        {task.parentTaskId && (
          <p className="text-[#888] text-xs mt-1">
            {t('studio:archive.editedFromOriginal', { taskId: task.parentTaskId })}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden">
        <SwipeableArchiveCard task={task} onDelete={onDelete}>
          {cardContent}
        </SwipeableArchiveCard>
      </div>
      <div className="hidden md:block">{cardContent}</div>
    </>
  );
}

export default function ArchiveClient() {
  const { t } = useTranslation(['studio', 'common']);
  const {
    tasks,
    isLoading,
    error,
    setFilters,
    page,
    totalPages,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    refetch,
  } = useTaskArchive();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return t('studio:archive.dateFormat', {
      year,
      month: month.toString().padStart(2, '0'),
      day: day.toString().padStart(2, '0'),
      hour: hour.toString().padStart(2, '0'),
      minute: minute.toString().padStart(2, '0')
    });
  };

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pageSizeDropdownOpen, setPageSizeDropdownOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeDropdownRef = useRef<HTMLDivElement>(null);
  const [pageSizeDropdownPosition, setPageSizeDropdownPosition] = useState<
    'bottom' | 'top'
  >('bottom');
  const [activeTab, setActiveTab] = useState<'image' | 'audio'>('image');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<number>>(
    new Set()
  );
  const [tasksToDelete, setTasksToDelete] = useState<number[] | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isDownloading, setIsDownloading] = useState(false);

  const actionTypeOptions = [
    { label: t('studio:archive.filters.all'), value: 'all' },
    { label: t('studio:tools.digitalGoods.title'), value: 'DIGITAL_GOODS' },
    { label: t('studio:tools.stylist.title'), value: 'STYLIST' },
    { label: t('studio:tools.virtualCasting.title'), value: 'VIRTUAL_CASTING' },
    { label: t('studio:tools.fanmeetingStudio.title'), value: 'FANMEETING_STUDIO' },
  ];

  const pageSizeOptions = [
    { label: '5' + t('studio:archive.pagination.perPage'), value: '5' },
    { label: '10' + t('studio:archive.pagination.perPage'), value: '10' },
    { label: '20' + t('studio:archive.pagination.perPage'), value: '20' },
    { label: '50' + t('studio:archive.pagination.perPage'), value: '50' },
  ];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete && !tasksToDelete) return;

    setIsDeleting(true);
    try {
      if (tasksToDelete) {
        const response = await deleteBatchTasks(tasksToDelete);
        console.log('Batch delete result:', response.data);

        setSelectedTaskIds(new Set());
        setIsSelectionMode(false);
        setTasksToDelete(null);
      } else if (taskToDelete) {
        await deleteTask(taskToDelete.taskId);
        setTaskToDelete(null);
      }

      refetch();
    } catch (error) {
      console.error('Failed to delete task(s):', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async (task: Task) => {
    if (!task.details?.result || isDownloading) return;

    setIsDownloading(true);
    try {
      let downloadUrl: string | undefined;
      let fileName = '';

      switch (task.actionType) {
        case 'BUTTER_COVER':
          downloadUrl = task.details.result.audioKey;
          fileName = `butter-cover-${task.taskId}-${Date.now()}.mp3`;
          break;
        case 'DIGITAL_GOODS':
        case 'DIGITAL_GOODS_EDIT':
          downloadUrl = task.details.result.imageUrl;
          fileName = `digital-goods-${task.taskId}-${Date.now()}.png`;
          break;
        case 'FANMEETING_STUDIO':
        case 'FANMEETING_STUDIO_EDIT':
          downloadUrl = task.details.result.imageUrl;
          fileName = `fanmeeting-studio-${task.taskId}-${Date.now()}.png`;
          break;
        case 'STYLIST':
        case 'STYLIST_EDIT':
          downloadUrl = task.details.result.imageUrl;
          fileName = `stylist-${task.taskId}-${Date.now()}.png`;
          break;
        case 'VIRTUAL_CASTING':
        case 'VIRTUAL_CASTING_EDIT':
          downloadUrl = task.details.result.imageUrl;
          fileName = `virtual-casting-${task.taskId}-${Date.now()}.png`;
          break;
        default:
          console.warn(
            'Unsupported action type for download:',
            (task as any).actionType
          );
          return;
      }

      if (!downloadUrl) {
        console.warn('No download URL found for task:', task.taskId);
        return;
      }

      await downloadFile(downloadUrl, fileName);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteCancel = () => {
    setTaskToDelete(null);
    setTasksToDelete(null);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedTaskIds(new Set());
  };

  const toggleTaskSelection = (taskId: number) => {
    const newSelectedIds = new Set(selectedTaskIds);
    if (newSelectedIds.has(taskId)) {
      newSelectedIds.delete(taskId);
    } else {
      newSelectedIds.add(taskId);
    }
    setSelectedTaskIds(newSelectedIds);
  };

  const handleBatchDelete = () => {
    if (selectedTaskIds.size === 0) return;
    setTasksToDelete(Array.from(selectedTaskIds));
  };

  const handleFilterSelect = (value: string) => {
    setSelectedFilter(value);

    if (value === 'all') {
      setFilters({
        category: activeTab === 'image' ? 'IMAGE' : 'AUDIO',
        actionType: '',
        actionTypes: [],
      });
    } else {
      setFilters({
        category: activeTab === 'image' ? 'IMAGE' : 'AUDIO',
        actionType: '',
        actionTypes: [value],
      });
    }
  };

  const handlePageSizeSelect = (value: string) => {
    setPageSize(parseInt(value));
    setPageSizeDropdownOpen(false);
  };

  useEffect(() => {
    if (pageSizeDropdownOpen && pageSizeDropdownRef.current) {
      const rect = pageSizeDropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 150 && spaceAbove > spaceBelow) {
        setPageSizeDropdownPosition('top');
      } else {
        setPageSizeDropdownPosition('bottom');
      }
    }
  }, [pageSizeDropdownOpen]);

  const totalResults = tasks.length;
  const startResult = Math.min(page * pageSize + 1, totalResults);
  const endResult = Math.min((page + 1) * pageSize, totalResults);

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(0, page - halfVisible);
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400 text-center">
          <h3 className="text-lg font-semibold mb-2">{t('studio:archive.messages.errorOccurred')}</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#25282c] min-h-screen">
      <div className="px-4 md:px-[90px] py-4 md:py-[44px]">
        {/* Header */}
        <h1 className="text-white text-2xl md:text-3xl font-bold mb-6 md:mb-8">
          {t('studio:archive.title')}
        </h1>

        {/* Tabs */}
        <div className="flex items-center gap-6 md:gap-8 mb-6">
          <button
            onClick={() => {
              setActiveTab('image');
              setSelectedFilter('all');
              setFilters({
                category: 'IMAGE',
                actionType: '',
                actionTypes: [],
              });
            }}
            className={`text-sm md:text-base font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'image'
                ? 'text-yellow-400 border-yellow-400'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            {t('studio:archive.tabs.imageGeneration')}
          </button>
          <button
            onClick={() => {
              setActiveTab('audio');
              setSelectedFilter('all');
              setFilters({
                category: 'AUDIO',
                actionType: '',
                actionTypes: [],
              });
            }}
            className={`text-sm md:text-base font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'audio'
                ? 'text-yellow-400 border-yellow-400'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            {t('studio:archive.tabs.audioGeneration')}
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {activeTab === 'image' && (
              <Dropdown
                isOpen={dropdownOpen}
                onToggle={() => setDropdownOpen(!dropdownOpen)}
                placeholder={
                  actionTypeOptions.find(
                    (option) => option.value === selectedFilter
                  )?.label || t('studio:archive.pagination.selectOption')
                }
                options={actionTypeOptions}
                onSelect={handleFilterSelect}
              />
            )}
          </div>

          {/* Selection Mode Controls */}
          <div className="flex items-center gap-3">
            {isSelectionMode && (
              <>
                <span className="text-gray-400 text-sm">
                  {selectedTaskIds.size} {t('studio:archive.pagination.selected')}
                </span>
                <button
                  onClick={handleBatchDelete}
                  disabled={selectedTaskIds.size === 0}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
                >
                  {t('studio:archive.delete')}
                </button>
                <button
                  onClick={toggleSelectionMode}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                >
                  {t('studio:archive.pagination.cancel')}
                </button>
              </>
            )}

            {!isSelectionMode && (
              <button
                onClick={toggleSelectionMode}
                className="p-2 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors"
                title={t('studio:archive.batchDelete')}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {(() => {
          const filteredTasks = tasks;

          return isLoading && filteredTasks.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">{t('studio:archive.messages.loading')}</div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400 text-center">
                <h3 className="text-lg font-semibold mb-2">
                  {activeTab === 'audio'
                    ? t('studio:archive.messages.noAudioGenerated')
                    : t('studio:archive.messages.noTasksGenerated')}
                </h3>
                <p className="text-sm">
                  {t('studio:archive.messages.startFirstTask')}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Task Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 mb-8">
                {filteredTasks.map((task) => (
                  <ArchiveTaskCard
                    key={task.taskId}
                    task={task}
                    onClick={() => handleTaskClick(task)}
                    onDelete={handleDeleteClick}
                    isSelectionMode={isSelectionMode}
                    isSelected={selectedTaskIds.has(task.taskId)}
                    onToggleSelect={toggleTaskSelection}
                    onDownload={handleDownload}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-8">
                {/* Left side - Show and page size selector */}
                <div className="flex items-center gap-4">
                  <span className="text-white text-sm">{t('studio:archive.pagination.display')}</span>
                  <div className="relative" ref={pageSizeDropdownRef}>
                    <button
                      onClick={() =>
                        setPageSizeDropdownOpen(!pageSizeDropdownOpen)
                      }
                      className="flex items-center gap-2 px-3 py-1 bg-[#25282c] border border-[#4a4a4b] text-white rounded text-sm hover:border-[#5a5a5b] transition-colors"
                    >
                      <span>{pageSize} {t('studio:archive.pagination.perPage')}</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${pageSizeDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {pageSizeDropdownOpen && (
                      <div
                        className={`absolute left-0 bg-[#25282c] border border-[#4a4a4b] rounded py-1 min-w-[80px] z-10 ${
                          pageSizeDropdownPosition === 'top'
                            ? 'bottom-full mb-1'
                            : 'top-full mt-1'
                        }`}
                      >
                        {pageSizeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handlePageSizeSelect(option.value)}
                            className="w-full px-3 py-1 text-left text-white text-sm hover:bg-[#4a4a4b] transition-colors"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side - Results info and page navigation */}
                <div className="flex items-center gap-6">
                  {/* Results info */}
                  <span className="text-white text-sm">
                    {totalResults > 0
                      ? t('studio:archive.messages.resultsCount', {
                          start: startResult.toString(),
                          end: endResult.toString(),
                          total: totalResults.toString()
                        })
                      : t('studio:archive.pagination.noResults')}
                  </span>

                  {/* Page navigation */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      {/* Previous button */}
                      <button
                        onClick={goToPreviousPage}
                        disabled={page === 0 || isLoading}
                        className="p-1 text-white hover:bg-[#4a4a4b] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Page numbers */}
                      {generatePageNumbers().map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          disabled={isLoading}
                          className={`px-3 py-1 text-sm rounded transition-colors disabled:opacity-50 ${
                            pageNum === page
                              ? 'bg-[#ffd93b] text-black'
                              : 'text-white hover:bg-[#4a4a4b]'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      ))}

                      {/* Show dots if there are more pages */}
                      {totalPages > 6 && page < totalPages - 4 && (
                        <>
                          <span className="text-white px-2">...</span>
                          <button
                            onClick={() => goToPage(totalPages - 1)}
                            disabled={isLoading}
                            className="px-3 py-1 text-sm text-white hover:bg-[#4a4a4b] rounded transition-colors disabled:opacity-50"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}

                      {/* Next button */}
                      <button
                        onClick={goToNextPage}
                        disabled={page >= totalPages - 1 || isLoading}
                        className="p-1 text-white hover:bg-[#4a4a4b] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={handleCloseModal} />
      )}

      {/* Delete Confirm Modal */}
      {(taskToDelete || tasksToDelete) && (
        <DeleteConfirmModal
          taskCount={tasksToDelete?.length}
          isOpen={true}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
