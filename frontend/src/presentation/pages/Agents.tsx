import React, { useState, useEffect, useMemo } from 'react';
import { useAgents, useCreateAgentDispatch, useDeleteAgentDispatch } from '../hooks/useAgents';
import { useRooms } from '../hooks/useRooms';
import { DataTable, TableSkeleton } from '../components/table';
import type { Column } from '../components/table';
import { StatusBadge, Button } from '../components/ui';
import { LiveIndicator } from '../components/ui/LiveIndicator';
import { PageContainer } from '../components/layout/PageContainer';
import { FilterBar } from '../components/filters';
import { MetricCard } from '../components/metrics';
import type { Agent } from '@/core/domain/Agent';
import { Bot, Plus, Trash2, Activity } from 'lucide-react';

/**
 * Agents page for managing agent dispatches
 */
export const Agents: React.FC = () => {
  const { data: agents, isLoading, error, refetch, isFetching, dataUpdatedAt } = useAgents();
  const { data: rooms } = useRooms();
  const createDispatch = useCreateAgentDispatch();
  const deleteDispatch = useDeleteAgentDispatch();

  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [searchValue, setSearchValue] = useState('');
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state for creating new agent dispatch
  const [newAgentName, setNewAgentName] = useState('');
  const [selectedRoomName, setSelectedRoomName] = useState('');
  const [agentMetadata, setAgentMetadata] = useState('');

  // Update last updated time when data changes
  useEffect(() => {
    if (dataUpdatedAt) {
      setLastUpdated(new Date(dataUpdatedAt));
    }
  }, [dataUpdatedAt]);

  // Calculate metrics
  const totalAgents = agents?.length || 0;
  const activeAgents = agents?.filter(agent => agent.state === 'ACTIVE').length || 0;
  const roomsWithAgents = agents ? new Set(agents.map(agent => agent.roomName)).size : 0;

  // Filter agents based on search value
  const filteredAgents = useMemo(() => {
    if (!agents) return [];

    return agents.filter((agent) => {
      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        const matchesSearch =
          agent.name.toLowerCase().includes(searchLower) ||
          agent.id.toLowerCase().includes(searchLower) ||
          agent.roomName?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [agents, searchValue]);

  // Format timestamp
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // Format agent state badge
  const getStateBadge = (state: string) => {
    switch (state) {
      case 'ACTIVE':
        return <StatusBadge status="success" label="Active" showDot />;
      case 'IDLE':
        return <StatusBadge status="info" label="Idle" />;
      case 'DISCONNECTED':
        return <StatusBadge status="error" label="Disconnected" />;
      case 'INITIALIZING':
        return <StatusBadge status="warning" label="Initializing" />;
      default:
        return <StatusBadge status="info" label={state} />;
    }
  };

  // Handle delete agent dispatch
  const handleDelete = async (agentId: string, roomName: string) => {
    if (!confirm('Are you sure you want to delete this agent dispatch?')) return;

    try {
      await deleteDispatch.mutateAsync({ dispatchId: agentId, roomName });
    } catch (error) {
      console.error('Failed to delete agent dispatch:', error);
      alert('Failed to delete agent dispatch');
    }
  };

  // Handle create agent dispatch
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAgentName || !selectedRoomName) {
      alert('Agent name and room are required');
      return;
    }

    try {
      await createDispatch.mutateAsync({
        roomName: selectedRoomName,
        agentName: newAgentName,
        metadata: agentMetadata || undefined,
      });

      // Reset form
      setNewAgentName('');
      setSelectedRoomName('');
      setAgentMetadata('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create agent dispatch:', error);
      alert('Failed to create agent dispatch');
    }
  };

  // Define table columns
  const columns: Column<Agent>[] = [
    {
      key: 'name',
      header: 'Agent Name',
      render: (agent) => (
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary-500" />
          <span className="font-mono text-sm">{agent.name}</span>
        </div>
      ),
    },
    {
      key: 'id',
      header: 'Dispatch ID',
      render: (agent) => (
        <span className="font-mono text-xs text-text-secondary">{agent.id}</span>
      ),
    },
    {
      key: 'roomName',
      header: 'Room',
      render: (agent) => (
        <span className="text-sm">{agent.roomName || '-'}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (agent) => (
        <span className="text-sm text-text-secondary">{agent.type}</span>
      ),
    },
    {
      key: 'state',
      header: 'State',
      render: (agent) => getStateBadge(agent.state),
    },
    {
      key: 'startedAt',
      header: 'Started At',
      render: (agent) => (
        <span className="text-xs text-text-secondary">
          {formatTimestamp(agent.startedAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (agent) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => agent.roomName && handleDelete(agent.id, agent.roomName)}
          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
          disabled={deleteDispatch.isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary mb-1">Agent Sessions</h1>
          <p className="text-sm text-text-secondary">
            Monitor active agent sessions in rooms. To see deployed agents, create a room and dispatch an agent.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LiveIndicator lastUpdated={lastUpdated} isLive={isFetching} />
          <Button
            variant="primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Dispatch
          </Button>
        </div>
      </div>

      {/* Create Agent Form */}
      {showCreateForm && (
        <div className="bg-surface-elevated border border-border-default rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Create Agent Dispatch</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Agent Name *
                </label>
                <input
                  type="text"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="Enter agent name"
                  className="w-full px-3 py-2 bg-surface-base border border-border-default rounded-md text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Room *
                </label>
                <select
                  value={selectedRoomName}
                  onChange={(e) => setSelectedRoomName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-base border border-border-default rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select a room</option>
                  {rooms?.map((room) => (
                    <option key={room.sid} value={room.name}>
                      {room.name} ({room.numParticipants} participants)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Metadata (Optional)
              </label>
              <textarea
                value={agentMetadata}
                onChange={(e) => setAgentMetadata(e.target.value)}
                placeholder="Enter metadata as JSON"
                rows={3}
                className="w-full px-3 py-2 bg-surface-base border border-border-default rounded-md text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={createDispatch.isPending}
              >
                {createDispatch.isPending ? 'Creating...' : 'Create Dispatch'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Active Agent Sessions"
          value={totalAgents}
          icon={<Bot className="h-5 w-5" />}
          description="Agents currently active in rooms"
        />
        <MetricCard
          title="Agent Participants"
          value={activeAgents}
          icon={<Activity className="h-5 w-5" />}
          trend={activeAgents > 0 ? { value: '+0%', positive: true } : undefined}
          description="Active agent connections"
        />
        <MetricCard
          title="Rooms with Agents"
          value={roomsWithAgents}
          icon={<Bot className="h-5 w-5" />}
          description="Rooms containing agent participants"
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onRefresh={refetch}
        isRefreshing={isFetching}
        autoRefresh={isAutoRefreshEnabled}
        onAutoRefreshChange={setIsAutoRefreshEnabled}
        lastUpdated={lastUpdated}
        placeholder="Search agents by name, ID, or room..."
      />

      {/* Data Table */}
      <div className="bg-surface-elevated border border-border-default rounded-lg overflow-hidden">
        {isLoading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500 mb-4">Failed to load agents</p>
            <Button variant="secondary" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <DataTable<Agent>
            columns={columns}
            data={filteredAgents}
            emptyMessage="No agent dispatches found"
            emptyDescription="Create a new agent dispatch to get started"
          />
        )}
      </div>
    </PageContainer>
  );
};
